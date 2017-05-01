/**
 * Created by stefan on 01/05/17.
 */

let tests = [
    [{  message: 'Hi',
        result: {
           'action': 'input.welcome'
        }
    }],[{
        message: 'Where is building 32?',
        result: {
            'action': 'find-building',
            'actionIncomplete': false,
            'parameters' : {
                'buidingNumber': '32',
                'key-building': 'building'
            },
        }
    }],[{
        message: 'Where is building?',
        result: {
            'action': 'find-building',
            'actionIncomplete': true,
            'parameters': {
                'buidingNumber': '',
                'key-building': 'building'
            },
        }
    }, {
        message: '32',
        result: {
            'action': 'find-building',
            'actionIncomplete': false,
            'parameters': {
                'buidingNumber': '32',
                'key-building': 'building'
            },
        }
    }],[{
        message: 'Where can I get condoms?',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Contraception'
            },
        }
    },{
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': false,
            'parameters': {
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
                'offering': 'Contraception'
            }

        }
    }],[{
        message: 'Where can I get booze?',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Alcohol'
            },
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': false,
            'parameters': {
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
                'offering': 'Alcohol'
            }

        }
    }],[{
        message: 'Where can I get coffee?',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Caffeine'
            },
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': false,
            'parameters': {
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
                'offering': 'Caffeine'
            }
        }
    }],[{
        message: 'Tell me about building 32 room 3001?',
        result: {
            'action': 'find-room-details',
            'actionIncomplete': false,
            'parameters': {
                'building': '32',
                'room': '3001'
            },
        }
    }],[{
        message: 'Where can I grab a room on 21st July 2018?',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': false,
            'parameters': {
                'bookingTime': '2018-07-21'
            },
        }
    }],[{
        message: 'Where can I grab a room?',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': true,
            'parameters': {
                'bookingTime': ''
            },
        }
    }, {
        message: '21st July 2018?',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': false,
            'parameters': {
                'bookingTime': '2018-07-21'
            },
        }
    }],[{
        message: 'When does term end?',
        result: {
            'action': 'when-term-end',
            'actionIncomplete': false,
            'parameters': {
                'term': 'Summer'
            },
        }
    }],[{
        message: 'When does winter term start?',
        result: {
            'action': 'when-term-start',
            'actionIncomplete': false,
            'parameters': {
                'term': 'Autumn'
            },
        }
    }],[{
        message: 'Get me to jesters',
        result: {
            'action': 'find-bus-from-and-to',
            'actionIncomplete': true,
            'parameters': {
                'busStopDest': 'Aldi Store',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-from-and-to',
            'actionIncomplete': false,
            'parameters': {
                'busStopDest': 'Aldi Store',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }],[{
        message: 'How can I get to the civic centre',
        result: {
            'action': 'find-bus-from-and-to',
            'actionIncomplete': true,
            'parameters': {
                'busStopDest': 'Civic Centre',
                'hidden-found-location-key': ''
            }
        },
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-from-and-to',
            'actionIncomplete': false,
            'parameters': {
                'busStopDest': 'Civic Centre',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }],[{
        message: 'Where is the nearest U1C',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'Unilink',
                'busRoute': 'U1C',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
                'busCompany': 'Unilink',
                'busRoute': 'U1C',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }],[{
        message: 'Where is the nearest T3',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': 'T3',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': 'T3',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }],[{
        message: 'Where is the nearest 7C',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'First in Hampshire',
                'busRoute': '7C',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
                'busCompany': 'First in Hampshire',
                'busRoute': '7C',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }],[{
        message: 'Where is the nearest bluestar 1 bus',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': '',
                'key-bus': 'bus'
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
                'key-bus': 'bus'
            }
        }
    }],[{
        message: 'Where is the nearest 1 bus',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': '',
                'busRoute': '1',
                'hidden-found-location-key': '',
                'key-bus': 'bus'
            }
        }
    }, {
        message: 'bluestar',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': '',
                'key-bus': 'bus'
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        result: {
        'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
            'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
                'key-bus': 'bus'
            }
        }
    }]
];

module.exports = tests;