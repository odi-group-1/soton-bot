let skills = [{
   title: 'Discover Campus Buildings',
    subtitle: 'I know where all the buildings on campus are located. I can help you find them.',
    image_url: 'http://imgur.com/5nc6azi.gif',
    default_action: {
        type: 'web_url',
        url: 'https://media.giphy.com/media/3o7bufy1oZb88O1fOg/giphy.gif',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Find Essentials',
    subtitle: 'Need condoms, an ATM, Pub, Petrol, any service. I will find it for you!',
    image_url: 'http://imgur.com/edMFqDQ.png',
    default_action: {
    type: 'web_url',
        url: 'https://media.giphy.com/media/l0Iy0B0IqK78EGVSo/giphy.gif',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}, {
 
    title: 'Locate Places To Eat',
    subtitle: 'If you\'re on campus I can find you something to nibble on.', 
    image_url: 'http://imgur.com/htosxDU.png',
    default_action: {
        type: 'web_url',
        url: 'https://media.giphy.com/media/l0Iy4RVheMJFwXbLG/giphy.gif',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Access Room Details',
    subtitle: 'Need a room, I can find you a room at any time you need and the details about the room.',
    image_url: 'http://imgur.com/KTGer6F.png',
    default_action: {
        type: 'web_url',
        url: 'https://media.giphy.com/media/l0Iyc5vgh0kar4UjS/giphy.gif',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
},{
    title: 'Help You Get Around',
    subtitle: 'We can help you find your way around Southampton via the expansive bus network.',
    image_url: 'http://imgur.com/VGEbOwI.png',
    default_action: {
        type: 'web_url',
        url: 'https://media.giphy.com/media/3o7bu0eDBm2WGPFy1i/giphy.gif',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}];

module.exports = {
    skills: skills
};
