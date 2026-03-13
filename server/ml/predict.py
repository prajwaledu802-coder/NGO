import json
import math
import sys
from typing import Any, Dict, List


def _safe_int(value: Any, fallback: int = 0) -> int:
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return fallback


def _event_type_defaults(event_type: str) -> Dict[str, int]:
    defaults = {
        'flood relief': {'volunteers': 25, 'food': 200, 'medical': 40, 'success': 78},
        'cleanup drive': {'volunteers': 10, 'food': 40, 'medical': 5, 'success': 82},
        'medical camp': {'volunteers': 15, 'food': 30, 'medical': 60, 'success': 84},
        'food distribution': {'volunteers': 18, 'food': 150, 'medical': 15, 'success': 80},
        'health camp': {'volunteers': 16, 'food': 28, 'medical': 58, 'success': 85},
    }
    return defaults.get((event_type or '').strip().lower(), {'volunteers': 14, 'food': 60, 'medical': 18, 'success': 76})


def _fallback_predict(payload: Dict[str, Any]) -> Dict[str, Any]:
    event_type = (payload.get('eventType') or '').strip()
    expected_people = _safe_int(payload.get('expectedPeople'), 100)
    defaults = _event_type_defaults(event_type)

    people_factor = max(expected_people / 500.0, 0.35)

    volunteers_needed = max(4, int(round(defaults['volunteers'] * people_factor)))
    food_needed = max(10, int(round(defaults['food'] * people_factor)))
    medical_needed = max(3, int(round(defaults['medical'] * people_factor)))

    success_probability = max(45, min(95, defaults['success'] + (3 if volunteers_needed >= defaults['volunteers'] else -4)))

    return {
        'volunteersNeeded': volunteers_needed,
        'foodKitsNeeded': food_needed,
        'medicalKitsNeeded': medical_needed,
        'eventSuccessProbability': success_probability,
        'modelType': 'fallback-linear',
    }


def _ml_predict(payload: Dict[str, Any]) -> Dict[str, Any]:
    import numpy as np
    import pandas as pd
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.linear_model import LinearRegression

    history = payload.get('historicalEvents') or []
    if len(history) < 3:
        return _fallback_predict(payload)

    df = pd.DataFrame(history)
    required_columns = {
        'eventType',
        'expectedPeople',
        'volunteersNeeded',
        'foodKitsNeeded',
        'medicalKitsNeeded',
        'successScore',
    }

    if not required_columns.issubset(df.columns):
        return _fallback_predict(payload)

    df = df.fillna(0)
    df['eventType'] = df['eventType'].astype(str).str.lower()

    x_num = df[['expectedPeople']]
    x_cat = pd.get_dummies(df['eventType'], prefix='event')
    x = pd.concat([x_num, x_cat], axis=1)

    target = {
        'volunteersNeeded': df['volunteersNeeded'],
        'foodKitsNeeded': df['foodKitsNeeded'],
        'medicalKitsNeeded': df['medicalKitsNeeded'],
        'successScore': df['successScore'],
    }

    lin_models = {}
    for key, y in target.items():
        model = LinearRegression()
        model.fit(x, y)
        lin_models[key] = model

    rf_model = RandomForestRegressor(n_estimators=120, random_state=42)
    rf_model.fit(x, target['successScore'])

    req_event_type = str(payload.get('eventType') or '').strip().lower() or 'general'
    req_people = _safe_int(payload.get('expectedPeople'), 100)

    req_frame = pd.DataFrame([{'eventType': req_event_type, 'expectedPeople': req_people}])
    req_cat = pd.get_dummies(req_frame['eventType'], prefix='event')
    req_x = pd.concat([req_frame[['expectedPeople']], req_cat], axis=1)
    req_x = req_x.reindex(columns=x.columns, fill_value=0)

    volunteers = _safe_int(lin_models['volunteersNeeded'].predict(req_x)[0], 0)
    food = _safe_int(lin_models['foodKitsNeeded'].predict(req_x)[0], 0)
    medical = _safe_int(lin_models['medicalKitsNeeded'].predict(req_x)[0], 0)

    success_reg = float(lin_models['successScore'].predict(req_x)[0])
    success_rf = float(rf_model.predict(req_x)[0])
    success = int(round((success_reg + success_rf) / 2.0))

    if math.isnan(success):
        success = 75

    return {
        'volunteersNeeded': max(1, volunteers),
        'foodKitsNeeded': max(0, food),
        'medicalKitsNeeded': max(0, medical),
        'eventSuccessProbability': max(1, min(99, success)),
        'modelType': 'linear-regression+random-forest',
        'trainingSamples': int(len(df)),
    }


def main() -> None:
    try:
        raw = sys.stdin.read().strip()
        payload = json.loads(raw) if raw else {}

        try:
            prediction = _ml_predict(payload)
        except Exception:
            prediction = _fallback_predict(payload)

        sys.stdout.write(json.dumps({'ok': True, 'prediction': prediction}))
    except Exception as error:
        sys.stdout.write(json.dumps({'ok': False, 'error': str(error)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
