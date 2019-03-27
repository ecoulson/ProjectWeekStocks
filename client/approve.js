const Table = document.getElementById("approve");

let slips = [];
getApprovedRequests();

function getApprovedRequests() {
	let approvedRequest = new XMLHttpRequest();
	approvedRequest.open("GET", "/api/slip")
	approvedRequest.addEventListener("load", function() {
		let newSlips = JSON.parse(this.responseText);
		console.log(newSlips);
		if (newSlips.length > slips.length) {
			slips = newSlips;
			transformSlipsToApprove(slips).forEach((slipNode) => {
				Table.appendChild(slipNode);
			});
		}
	})
	approvedRequest.send();
}

function transformSlipsToApprove(slips) {
	let rows = [];
	slips.map((slip, i) => {
		let row = document.createElement("tr"); 

		let teamName = document.createElement("td");
		teamName.innerHTML = slip.teamName
		row.appendChild(teamName);

		let ticker = document.createElement("td");
		ticker.innerHTML = slip.ticker
		row.appendChild(ticker);

		let quantity = document.createElement("td");
		quantity.innerHTML = slip.shares
		row.appendChild(quantity);

		let market = document.createElement("td");
		market.innerHTML = slip.market ? "yes" : "no"
		row.appendChild(market);

		let shareValue = document.createElement("td");
		let shareValueInput = document.createElement("input");
		shareValueInput.id = "slip-" + i;
		shareValueInput.className = 'market-value';
		shareValueInput.placeholder = 'Market value...';
		shareValueInput.addEventListener("change", (event) => {
			let slip = slips[event.target.id.split("-")[1]];
			slip.pps = event.target.value;
		})

		if (slip.market) {
			shareValue.appendChild(shareValueInput);
		}
		row.appendChild(shareValue);

		let limit = document.createElement("td");
		limit.innerHTML = slip.limit
		row.appendChild(limit);

		let stop = document.createElement("td");
		stop.innerHTML = slip.stop
		row.appendChild(stop);

		let approve = document.createElement("td");
		let approveButton = document.createElement("input");
		approveButton.className = "approve";
		approveButton.id = "slip-" + i;
		approveButton.type = "button";
		approveButton.value = "Approve";
		approveButton.addEventListener("click", (event) => {
			if (!event.target.parentNode.parentNode.children[4].hasChildNodes() || 
				event.target.parentNode.parentNode.children[4].children[0].value.length != 0) {
				Table.removeChild(row);
				approveSlip(event.target.id);
			}
		})

		approve.appendChild(approveButton)
		row.appendChild(approve);

		rows.push(row);
	});
	return rows;
}

function approveSlip(slipID) {
	let id = slipID.split('-')[1];
	let approvedRequest = new XMLHttpRequest();
	approvedRequest.open("POST", "/api/approve/" + id);
	approvedRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	approvedRequest.send(JSON.stringify(slips[id]));
}