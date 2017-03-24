/**
 * Created by stefan on 24/03/17.
 */

let amenity = (searchCriteria, today) => {
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
        select: [ 'DISTINCT',
            '?Location',
            '(SAMPLE (?shop) AS ?LocationShop)',
            '(SAMPLE (?name) AS ?LocationName)',
            '(SAMPLE (?lat) AS ?LocationLat)',
            '(SAMPLE (?long) AS ?LocationLong)',
            '(SAMPLE (?day) AS ?LocationDay)',
            '(SAMPLE (?opens) AS ?LocationOpens)',
            '(SAMPLE (?closes) AS ?LocationCloses)' ],
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
                type: 'OPTIONAL',
                s: '?Location',
                p: 'geo:lat',
                o: '?lat'
            },
            {
                type: 'OPTIONAL',
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
                cond: '?name = \"' + searchCriteria + '\" && ?day = gr:'+today
            },
        ],
        group: '?Location',
        limit: 100
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

let building = (buildingId) => {
  return {
      endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
      select: [ '*' ],
      where: [
          {
              type: 'STANDARD',
              s: '?s',
              p: '?p',
              o: '?o'
          },
          {
              type: 'FILTER',
              cond: '?s = <http://id.southampton.ac.uk/building/'+buildingId+'> '+
              '&& (?p = <http://www.w3.org/2003/01/geo/wgs84_pos#lat> '+
              '|| ?p = <http://www.w3.org/2003/01/geo/wgs84_pos#long>)'
          }
      ]
  }
};

module.exports = {
    amenity : amenity,
    food : food,
    building : building
};


