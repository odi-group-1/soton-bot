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
            },
            {
                id: 'ns0:',
                at: '<http://purl.org/goodrelations/v1#>'
            },
            {
                id: 'geo:',
                at: '<http://www.w3.org/2003/01/geo/wgs84_pos#>'
            }
        ],
        select: [ '?Location', '?shop', '?name', '?lat', '?long', '?day', '?opens', '?closes' ],
        where: [
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'a',
                o: 'gr:Offering'
            },
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'gr:availableAtOrFrom',
                o: '?Location'
            },
            {
                type: 'STANDARD',
                s: '?Offering',
                p: 'rdfs:label',
                o: '?name'
            },
            {
                type: 'STANDARD',
                s: '?Location',
                p: 'a',
                o: 'ns0:LocationOfSalesOrServiceProvisioning'
            },
            {
                type: 'OPTIONAL',
                s: '?Location',
                p: 'rdfs:label',
                o: '?shop'
            },
            {
                type: 'STANDARD',
                s: '?Location',
                p: 'geo:lat',
                o: '?lat'
            },
            {
                type: 'STANDARD',
                s: '?Location',
                p: 'geo:long',
                o: '?long'
            },
            {
                type: 'OPTIONAL',
                s: '?Location',
                p: 'gr:hasOpeningHoursSpecification',
                o: '?Hours'
            },
            {
                type: 'OPTIONAL',
                s: '?Hours',
                p: 'gr:hasOpeningHoursDayOfWeek',
                o: '?day'
            },
            {
                type: 'OPTIONAL',
                s: '?Hours',
                p: 'gr:opens',
                o: '?opens'
            },
            {
                type: 'OPTIONAL',
                s: '?Hours',
                p: 'gr:closes',
                o: '?closes'
            },
            {
                type: 'FILTER',
                cond: '?name = \"' + searchCriteria + '\"'
            }
        ],
        limit: 700
    }
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


