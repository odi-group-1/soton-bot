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
        sessionId: '1100',
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
        sessionId: '1100',
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
        sessionId: '1200',
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
    },{
        message: 'Where can I get booze?',
        sessionId: '1201',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Alcohol'
            },
        },
        followUp: {
            message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            result: {
                'action': 'find-nearest-service',
                'actionIncomplete': false,
                'parameters': {
                    'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan',
                    'offering': 'Alcohol'
                }

            }
        }
    },{
        message: 'Where can I get coffee?',
        sessionId: '1202',
        result: {
            'action': 'find-nearest-service',
            'actionIncomplete': true,
            'parameters': {
                'hidden-found-location-key': '',
                'offering': 'Caffeine'
            },
        },
        followUp: {
            message: 'got-coords--InaDeepakTomShakibStefan-hidden-key',
            result: {
                'action': 'find-nearest-service',
                'actionIncomplete': false,
                'parameters': {
                    'hidden-found-location-key': 'got-coords--InaDeepakTomShakibStefan',
                    'offering': 'Caffeine'
                }
            }
        }
    },{
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
    },{
        message: 'Where can I grab a room on 21st July 2018?',
        sessionId: '1400',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': false,
            'parameters': {
                'bookingTime': '2018-07-21'
            },
        }
    },{
        message: 'Where can I grab a room?',
        sessionId: '1401',
        result: {
            'action': 'find-bookable-rooms',
            'actionIncomplete': true,
            'parameters': {
                'bookingTime': ''
            },
        },
        followUp: {
            message: '21st July 2018?',
            result: {
                'action': 'find-bookable-rooms',
                'actionIncomplete': false,
                'parameters': {
                    'bookingTime': '2018-07-21'
                },
            }
        }
    },{

    }
];