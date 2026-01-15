export class CommonUtils {
    static compareDate(date_1, date_2) {
        let result = false
        if (date_1.getDate() == date_2.getDate() && 
            date_1.getMonth() == date_2.getMonth() && 
            date_1.getFullYear() == date_2.getFullYear()) result = true
        return result
    }
}