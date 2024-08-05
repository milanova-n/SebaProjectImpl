import moment from "moment"
export const StringToDate = (dateString) => {
   return moment(dateString).format("DD/MM/YYYY HH:mm")
}