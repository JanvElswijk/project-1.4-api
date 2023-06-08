const dateConverter = (dateOfBirth) => {
    const dateArray = user.dateOfBirth.split('-');
    if (dateArray[0].length === 4) {
        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    } else {
        return dateOfBirth;
    }
}

module.exports = {
    dateConverter
}