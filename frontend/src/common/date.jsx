const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()} ${monthsArray[newDate.getMonth()]}`
};

export const getFullday = (date) => {
    const newDate = new Date(date);

    return `${newDate.getDate()} ${monthsArray[newDate.getMonth()]} ${newDate.getFullYear()}`
}