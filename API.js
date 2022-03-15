async function load(logID) {
    const response = await fetch("http://45.142.114.107:8082/chatlog/v1/get/" + logID + "/")

    if(response.ok) {
        const json = await response.json();
        const messages = json["messages"]


        var table = document.getElementById('table')

        for (let i = 0; i < messages.length; i++) {
            const messageObject = messages[i]
            const uuid = messageObject["uuid"]
            const time = messageObject["time"]
            const displayName = messageObject["displayName"]
            const message = messageObject["message"]
            const dateObject = new Date(time)

            var row = `<tr>
							<td id="head"><img src="https://mc-heads.net/avatar/${uuid}/35.png"></td>
							<td id="name">${escapeHtml(displayName)}</td>
							<td id="message">${escapeHtml(message)}</td>
							<td id="time">${dateObject.toLocaleString("de-DE")}</td>
					  </tr>`
            table.innerHTML += row

        }
    }else {
        setState(`<h1>Error</h1>
         <h3>${response.status}</h3>`
        )
    }
}

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
         <h3>URL-Parameter logID is missing</h3>`
    )
}

