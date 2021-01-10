class WorkingPlace {
    constructor(data) {
        this.workingPlaceID = data.workingPlaceID
        this.workingPlaceNameEng = data.workingPlaceNameEng
        this.workingPlaceNameHeb = data.workingPlaceNameHeb || null
        this.workingPlaceNameArb = data.workingPlaceNameArb || null
    }
    get data() {
        return {
            workingPlaceID: this.workingPlaceID,
            workingPlaceNameEng: this.workingPlaceNameEng,
            workingPlaceNameHeb: this.workingPlaceNameHeb,
            workingPlaceNameArb: this.workingPlaceNameArb
        }
    }

}

class workingPlaceDepartment {
    constructor(data) {
        this.workingPlaceDepartmentID = data.workingPlaceDepartmentID
        this.workingPlacDepartmenetNameEng = data.workingPlacDepartmenetNameEng
        this.workingPlacDepartmenetNameHeb = data.workingPlacDepartmenetNameHeb || null
        this.workingPlacDepartmenetNameArb = data.workingPlacDepartmenetNameArb || null
    }
    get data() {
        return {
            workingPlaceDepartmentID: this.workingPlaceDepartmentID,
            workingPlacDepartmenetNameEng: this.workingPlacDepartmenetNameEng,
            workingPlacDepartmenetNameHeb: this.workingPlacDepartmenetNameHeb,
            workingPlacDepartmenetNameArb: this.workingPlacDepartmenetNameArb
        }
    }
}



module.exports = {
    WorkingPlace,
    workingPlaceDepartment
}