const submitButton = document.getElementById("submit");
const typeSelect = document.getElementById("type");
const teamNameSelect = document.getElementById("team-name");
const symbolInput = document.getElementById("stock-symbol");
const shareQuantity = document.getElementById("share-quantity");
const marketCheckbox = document.getElementById("market");
const limitInput = document.getElementById("limit");
const stopInput = document.getElementById("stop");

let slipRequest = null;

submitButton.addEventListener('mouseenter', (event) => {
	slipRequest = {
		type: typeSelect.value,
		teamName: teamNameSelect.value,
		ticker: symbolInput.value,
		shares: shareQuantity.value,
		market: marketCheckbox.checked,
		limit: limitInput.value,
		stop: stopInput.value
	};
	if (isValidSlipRequest(slipRequest)) {
		submitButton.style.backgroundColor = 'green';
	} else {
		submitButton.style.backgroundColor = 'red';
	}
});

submitButton.addEventListener('mouseleave', (event) => {
	submitButton.style.backgroundColor = 'rgb(150, 150, 150)';
})

submitButton.addEventListener('click', (event) => {	
	if (isValidSlipRequest(slipRequest)) {
		sendRequest(slipRequest);
	}
});

function isValidSlipRequest(slipRequest) {
	if (slipRequest == null) {
		return false;
	}
	if (slipRequest.ticker.length == 0) {
		return false;
	}
	if (slipRequest.shares.length == 0 && parseInt(slipRequest.shares) > 0) {
		return false;
	}
	return true;
}

function sendRequest(slipRequest) {
	let request = new XMLHttpRequest();
	request.open("POST", "/api/slip");
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.send(JSON.stringify(slipRequest));
	request.addEventListener("load", () => {
		alert("Request submitted to the desk for approval");
	})
}