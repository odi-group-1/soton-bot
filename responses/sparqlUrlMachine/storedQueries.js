/**
 * Created by stefan on 24/03/17.
 */

let amenity = (searchCriteria) => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'rdfs:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'gr:',
                at: '<http://purl.org/goodrelations/v1#>'
            }
        ],
        select: ['?Location', '?name'],
        where: [
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'a',
                o: 'gr:Offering',
                cond: undefined
            },
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'gr:availableAtOrFrom',
                o: '?Location',
                cond: undefined
            },
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'rdfs:label',
                o: '?name',
                cond: undefined
            },
            {
                type: 'FILTER',
                s: '?Offering',
                p: 'gr:availableAtOrFrom',
                o: '?Location',
                cond: '?name = \"'+searchCriteria+'\"'
            },

        ],
        limit: 100
    };
};

let food = () => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'rdfs:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'geo:',
                at: '<http://www.w3.org/2003/01/geo/wgs84_pos#>'
            },
            {
                id: 'ns:',
                at: '<http://id.southampton.ac.uk/ns/>'
            }
        ],
        select: [ '*' ],
        where: [
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'a',
                o: 'ns:FoodOrDrinkEstablishment'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'geo:lat',
                o: '?lat'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'geo:long',
                o: '?long'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'rdfs:label',
                o: '?name'
            }
        ],
        limit: 10000
    };
};

module.exports = {
    amenity : amenity,
    food : food
};


