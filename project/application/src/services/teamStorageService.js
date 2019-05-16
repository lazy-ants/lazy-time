export function getAvailableTeamsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('availableTeams'));
}

export function setAvailableTeamsToLocalStorage(data) {
    localStorage.setItem('availableTeams', JSON.stringify(data));
}

export function removeAvailableTeamsFromLocalStorage() {
    localStorage.removeItem('availableTeams');
}

export function getCurrentTeamDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('currentTeamData'));
}

export function setCurrentTeamDataToLocalStorage(data) {
    localStorage.setItem('currentTeamData', JSON.stringify(data));
}

export function removeCurrentTeamDataFromLocalStorage() {
    localStorage.removeItem('currentTeamData');
}
