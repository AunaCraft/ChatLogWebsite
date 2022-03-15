async function load(logID) {
    const response = await fetch("http://localhost:8080/chatlog/v1/get/" + logID + "/")

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
							<td id="time">${dateObject.toLocaleString("de-DE")}</td>
							<td id="name">${displayName}</td>
							<td id="message">${message}</td>
					  </tr>`
            table.innerHTML += row

        }
    }else {
        setState(`<h1>Error</h1>
         <h3>${response.status}</h3>`
        )
    }
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
         <h3>Parameter logID is missing</h3>`
    )
}

