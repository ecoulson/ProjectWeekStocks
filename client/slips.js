let request = new XMLHttpRequest();
let Table = document.getElementById("slips-table");

let slips = [];

request.open("GET", '/api/slip/log');
request.addEventListener("load", function(event) {
	slips = JSON.parse(this.responseText);
	slips.forEach((slip) => {
		let row = document.createElement("tr");

		let teamNode = document.createElement("td");
		teamNode.innerHTML = slip.teamName;
		row.appendChild(teamNode);

		let tickerNode = document.createElement("td");
		tickerNode.innerHTML = slip.ticker;
		row.appendChild(tickerNode);

		let shareNode = document.createElement("td");
		shareNode.innerHTML = slip.shares;
		row.appendChild(shareNode);

		let ppsNode = document.createElement("td");
		ppsNode.innerHTML = "$" + slip.pps;
		row.appendChild(ppsNode);

		let valueNode = document.createElement("td");
		valueNode.innerHTML = "$" + slip.value;
		row.appendChild(valueNode);

		let marketNode = document.createElement("td");
		marketNode.innerHTML = slip.market ? "Yes" : "No";
		row.appendChild(marketNode);

		let typeNode = document.createElement("td");
		typeNode.innerHTML = slip.type;
		row.appendChild(typeNode);

		let limitNode = document.createElement("td");
		limitNode.innerHTML = slip.limit.length == 0 ? "N/A" : limitNode;
		row.appendChild(limitNode);

		let stopNode = document.createElement("td");
		stopNode.innerHTML = slip.stop.length == 0 ? "N/A" : limitNode;
		row.appendChild(stopNode);

		let balanceNode = document.createElement("td");
		balanceNode.innerHTML = "$" + slip.balance;
		row.appendChild(balanceNode);

		Table.appendChild(row);
	})
});
request.send();