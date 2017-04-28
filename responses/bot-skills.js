let skills = [{
   title: 'Discover Campus Buildings',
    subtitle: 'I know where all the buildings on campus are located. I can help you find them.',
    image_url: 'http://i.imgur.com/I353pXy.png'
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Find Essentials',
    subtitle: 'Need condoms, an ATM, Pub, Petrol, any service. I will find it for you!',
    image_url: 'https://docs.oracle.com/cd/E21454_01/html/821-2584/figures/HTTPS_Collab_Sample.png',
    default_action: {
    type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}, {
 
    title: 'Locate Places To Eat',
    subtitle: 'If you\'re on campus I can find you something to nibble on.', 
    image_url: 'http://i.imgur.com/I353pXy.png'
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Determine Term Times',
    subtitle: 'Need to know when you get to go home, ask me, I\'ll help remind you when to pack up.', 
    image_url: 'http://i.imgur.com/I353pXy.png'
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Room Details',
    subtitle: 'Need a room, I can find you a room at any time you need and the details about the room.',
    image_url: 'http://i.imgur.com/I353pXy.png'
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Help You Get Around',
    subtitle: 'We can help you find your way around Southampton via the expansive bus network.',
    image_url: 'http://i.imgur.com/I353pXy.png'
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}


}];

module.exports = {
    skills: skills
};
