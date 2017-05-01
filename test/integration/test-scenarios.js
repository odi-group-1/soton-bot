/**
 * Created by stefan on 01/05/17.
 */

let tests = [
    {   message: 'Hi',
        sessionId: '1000',
        result: {
           'action': 'input.welcome'
        }
    },{
        message: 'Where is building 32?',
        sessionId: '1001',
        result: {
            'action': 'find-building',
            'actionIncomplete': false,
            'parameters' : {
                'buidingNumber': '32',
                'key-building': 'building'
            },
        }
    },{
        message: 'Where is building?',
        sessionId: '1002',
        result: {
            'action': 'find-building',
            'actionIncomplete': true,
            'parameters' : {
                'buidingNumber': '',
                'key-building': 'building'
            },
        },
        followUp: {
            message: '32',
            result: {
                'action': 'find-building',
                'actionIncomplete': false,
                'parameters': {
                    'buidingNumber': '32',
                    'key-building': 'building'
                },
            }
        }
    },{
        message: 'Where can I get condoms?',
        sessionId: '1003',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Contraception'
            },
        },
        followUp: {
            message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            result: {
                'action': 'find-nearest-service',
                'actionIncomplete': false,
                'parameters': {
                    'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan',
                    'offering': 'Contraception'
                }

            }
        }
    }
];