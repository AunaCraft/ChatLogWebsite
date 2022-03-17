const apiAddress = "dev.aunacraft.de:8082"

var currentlyLoadedID = "Nothing is loaded!";

async function load(logID) {

    document.title = "Loading..."

    const response = await fetch("http://" + apiAddress + "/chatlog/v1/get/" + logID + "/")

    currentlyLoadedID = logID

    if(response.ok) {

        document.title = "AunaCraft | ChatLog#" + logID

        const json = await response.json();
        const messages = json["messages"]

        const table = document.getElementById('table');

        for (let i = 0; i < messages.length; i++) {
            const messageObject = messages[i]
            const uuid = messageObject["uuid"]
            const time = messageObject["time"]
            const displayName = messageObject["displayName"]
            const message = messageObject["message"]
            const dateObject = new Date(time)

            var row = `<tr>
							<td id="head"><img src="https://mc-heads.net/avatar/${uuid}/35.png"></td>
							<td id="name">${escapeHtml(displayName) + ":"}</td>
							<td id="message">${escapeHtml(message)}</td>
							<td id="time">${dateObject.toLocaleString("de-DE")}</td>
					  </tr>`
            table.innerHTML += row
        }
    }else {

        document.title = "AunaCraft | ChatLog [Error]"

        var errorMessage = "Response-Code: " + response.status;
        if(response.status == 404){
            errorMessage = "Requested Log does not exist"
        }
        setState(`<h1 style="color: #dd0027">Error</h1>
         <h3 style="padding-bottom: 400px">${errorMessage}</h3>`
        )
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function resetTable(){
    const table = document.getElementById('table');
    table.innerHTML = ""
    setState("")
}

document.getElementById("searchButton").addEventListener("click", function () {
    const logID = document.querySelector("input").value;

    if(logID == currentlyLoadedID){
        setState("<h3>This Log is already shown!</h3>")
        delay(1000).then(() => setState(""));
        return
    }

    console.log("Showing log with id " + logID)
    resetTable()
    load(logID)
})

function escapeHtml(raw) {
    return raw.replace(/[&<>"']/g, function onReplace(match) {
        return '&#' + match.charCodeAt(0) + ';';
    });
}

function setState(code) {
    document.getElementById('state').innerHTML = code;
}

const url = new URL(document.location)
const logID = url.searchParams.get("logID")

if(logID != null) {
    load(logID)
}else {
    setState(
        `<h1>Invalid Request</h1>
         <h3 style="padding-bottom: 400px">URL-Parameter logID is missing</h3>`
    )
}

