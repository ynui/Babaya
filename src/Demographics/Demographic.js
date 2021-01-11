class Demographic {
    constructor(data) {
        this.country = new Country(data.country)
        this.county = new County(data.county)
        this.city = new City(data.city)
        this.street = new Street(data.street)
    }
}

class DemographicOther {
    constructor(data) {
        this.country = new Country(data.country)
        this.county = new County(data.county)
        this.city = new City(data.city)
        this.street = new Street(data.street)
    }
}

class Country {
    constructor(data) {
        this.countryID = data.countryID
        this.countryNameEng = data.countryNameEng
        this.countryNameHeb = data.countryNameHeb || null
        this.countryNameArb = data.countryNameArb || null
    }
    get data() {
        return {
            countryID: this.countryID,
            countryNameEng: this.countryNameEng,
            countryNameHeb: this.countryNameHeb,
            countryNameArb: this.countryNameArb
        }
    }

}

class County {
    constructor(data) {
        this.countyID = data.countyID
        this.countyNameEng = data.countyNameEng
        this.countyNameHeb = data.countyNameHeb || null
        this.countyNameArb = data.countyNameArb || null
    }
    get data() {
        return {
            countyID: this.countyID,
            countyNameEng: this.countyNameEng,
            countyNameHeb: this.countyNameHeb,
            countyNameArb: this.countyNameArb
        }
    }
}

class City {
    constructor(data) {
        this.cityID = data.cityID
        this.cityNameEng = data.cityNameEng
        this.cityNameHeb = data.cityNameHeb || null
        this.cityNameArb = data.cityNameArb || null
    }
    get data() {
        return {
            cityID: this.cityID,
            cityNameEng: this.cityNameEng,
            cityNameHeb: this.cityNameHeb,
            cityNameArb: this.cityNameArb
        }
    }
}

class Street {
    constructor(data) {
        this.streetID = data.streetID
        this.streetNameEng = data.streetNameEng
        this.streetNameHeb = data.streetNameHeb || null
        this.streetNameArb = data.streetNameArb || null
    }
    get data() {
        return {
            streetID: this.streetID,
            streetNameEng: this.streetNameEng,
            streetNameHeb: this.streetNameHeb,
            streetNameArb: this.streetNameArb
        }
    }
}

module.exports = {
    Demographic,
    DemographicOther,
    Country,
    County,
    City,
    Street
}