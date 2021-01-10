const DB_Utils = require('../DB/utils')

class AreaOfInterest {
    constructor(data) {
        this.areaOfInterestID = data.areaOfInterestID
        this.areaOfInterestNameEng = data.areaOfInterestNameEng
        this.areaOfInterestNameHeb = data.areaOfInterestNameHeb || null
        this.areaOfInterestNameArb = data.areaOfInterestNameArb || null
    }
    get data() {
        return {
            areaOfInterestID: this.areaOfInterestID,
            areaOfInterestNameEng: this.areaOfInterestNameEng,
            areaOfInterestNameHeb: this.areaOfInterestNameHeb,
            areaOfInterestNameArb: this.areaOfInterestNameArb
        }
    }
}

class SubAreaOfInterest {
    constructor(data) {
        this.SubAreaOfInterestID = data.SubAreaOfInterestID
        this.SubAreaOfInterestEng = data.SubAreaOfInterestEng
        this.SubAreaOfInterestHeb = data.SubAreaOfInterestHeb || null
        this.SubAreaOfInterestArb = data.SubAreaOfInterestArb || null
    }
    get data() {
        return {
            SubAreaOfInterestID: this.SubAreaOfInterestID,
            SubAreaOfInterestEng: this.SubAreaOfInterestEng,
            SubAreaOfInterestHeb: this.SubAreaOfInterestHeb,
            SubAreaOfInterestArb: this.SubAreaOfInterestArb
        }
    }

}


module.exports = {
    AreaOfInterest,
    SubAreaOfInterest
} 