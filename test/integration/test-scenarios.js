/**
 * Created by stefan on 01/05/17.
 */

let tests = [
    [{   message: 'Hi',
        sessionId: '1000',
        result: {
           'action': 'input.welcome'
        }
    }],[{
        message: 'Where is building 32?',
        sessionId: '1100',
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
        sessionId: '1101',
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
        sessionId: '1002',
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
        sessionId: '1200',
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
        sessionId: '1003',
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
        sessionId: '1201',
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
        sessionId: '1201',
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
        sessionId: '1202',
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
        sessionId: '1202',
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
        sessionId: '1300',
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
        sessionId: '1400',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': false,
            'parameters': {
                'bookingTime': '2018-07-21'
            },
        }
    }],[{
        message: 'Where can I grab a room?',
        sessionId: '1401',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': true,
            'parameters': {
                'bookingTime': ''
            },
        }
    }, {
        message: '21st July 2018?',
        sessionId: '1401',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': false,
            'parameters': {
                'bookingTime': '2018-07-21'
            },
        }
    }],[{
        message: 'When does term end?',
        sessionId: '1500',
        result: {
            'action': 'when-term-end',
            'actionIncomplete': false,
            'parameters': {
                'term': 'Summer'
            },
        }
    }],[{
        message: 'When does winter term start?',
        sessionId: '1501',
        result: {
            'action': 'when-term-start',
            'actionIncomplete': false,
            'parameters': {
                'term': 'Autumn'
            },
        }
    }],[{
        message: 'Get me to jesters',
        sessionId: '1600',
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
        sessionId: '1600',
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
        sessionId: '1601',
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
        essionId: '1601',
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
        sessionId: '1700',
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
        sessionId: '1700',
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
        sessionId: '1701',
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
        sessionId: '1701',
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
        sessionId: '1702',
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
        sessionId: '1702',
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
        sessionId: '1703',
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
        sessionId: '1703',
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
        sessionId: '1704',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': '',
                'busRoute': '1',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'bluestar',
        sessionId: '1703',
        result: {
            'action': 'find-bus-stop-for-route',
            'actionIncomplete': true,
            'parameters': {
                'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': ''
            }
        }
    }, {
        message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
        sessionId: '1703',
        result: {
        'action': 'find-bus-stop-for-route',
            'actionIncomplete': false,
            'parameters': {
            'busCompany': 'Bluestar',
                'busRoute': '1',
                'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            }
        }
    }]
];

module.exports = tests;