let skills = [{
    title: 'Skill A',
    subtitle: 'I can do skill A for you',
    image_url: 'https://docs.oracle.com/cd/E21454_01/html/821-2584/figures/HTTPS_Collab_Sample.png',
    default_action: {
    type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}, {
    title: 'Skill B',
    subtitle: 'I can do skill B for you',
    image_url: 'https://docs.oracle.com/cd/E21454_01/html/821-2584/figures/HTTPS_Collab_Sample.png',
    default_action: {
        type: 'web_url',
        url: 'https://www.openstreetmap.org/?mlat=50.93643&mlon=-1.395894#map=19/50.93643/-1.39589&layers=N',
        messenger_extensions: true,
        webview_height_ratio : 'tall',
    }
}];

module.exports = {
    skills: skills
};