/**
 * Created by stefan on 24/03/17.
 */

let amenity = (searchCriteria) => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                'id': 'rdfs:',
                'at': '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                'id': 'gr:',
                'at': '<http://purl.org/goodrelations/v1#>'
            }
        ],
        select: ['?Location', '?name'],
        where: [
            {
                'type': 'STANDARD',
                's': '?Offering',
                'p': 'a',
                'o': 'gr:Offering',
                'cond': undefined
            },
            {
                'type': 'STANDARD',
                's': '?Offering',
                'p': 'gr:availableAtOrFrom',
                'o': '?Location',
                'cond': undefined
            },
            {
                'type': 'STANDARD',
                's': '?Offering',
                'p': 'rdfs:label',
                'o': '?name',
                'cond': undefined
            },
            {
                'type': 'FILTER',
                's': '?Offering',
                'p': 'gr:availableAtOrFrom',
                'o': '?Location',
                'cond': '?name = \"'+searchCriteria+'\"'
            },

        ],
        limit: 100
    };
};

module.exports = {
    amenity : amenity
};


