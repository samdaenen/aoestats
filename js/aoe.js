var ids = [	'497557' /*Randy*/,
			'505233' /*Tom*/,
			'4539222' /*Wesley*/,
			'4002545' /*Alex*/,
			'1485119' /*Tim*/,
			'1476410' /*Samzehboy*/,
			'4680094' /*Vincent*/,
			'4355909' /*Sander*/,
			'2428407' /*Stijn*/,
			'3971641' /*Stefan*/			
];
let stats = [];

 function getData() {
	if (ids.length != undefined) {
		for (let i = 0; i < ids.length; ++i) {
			var request = new XMLHttpRequest();
			user_url = 'https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=0&profile_id='+ ids[i]
			request.open('GET', user_url, false),
			request.send(null)
			var json = JSON.parse(request.response)
			stats.push(extractStats(json))
		}
	}
} 

function extractStats(json) {
    //console.log("Extract Stats:", json);
    let rank 	= 0;
    let rating 	= 0;
    let highestRating = 0;
    let gamesWon = 0;
    let gamesLoose = 0;
    let gameWinPercent = 0.0;
    let gamesPlayed = 0;
    let player_name = "no name";
    
    if(json.leaderboard.length !== 0){	
        if(json.leaderboard[0].name != null) player_name = json.leaderboard[0].name;
        if(json.leaderboard[0].rank != null) rank +=  json.leaderboard[0].rank;
        if(json.leaderboard[0].rating != null) rating += json.leaderboard[0].rating;
        if(json.leaderboard[0].highest_rating != null) highestRating += json.leaderboard[0].highest_rating;
        if(json.leaderboard[0].wins != null) gamesWon += json.leaderboard[0].wins;
        if(json.leaderboard[0].losses != null) gamesLoose += json.leaderboard[0].losses;
        if(json.leaderboard[0].games != null) gamesPlayed += json.leaderboard[0].games;
        if(json.leaderboard[0].gamesPlayed != 0 && gamesWon != 0) gameWinPercent += ((gamesWon/gamesPlayed)*100).toFixed(0);
                //creating the result
        const stats = { name: player_name,
                    ranking: rank,
                    elo: rating,
                    high_elo: highestRating,
                    total_games: gamesPlayed,
                    won_games: gamesWon,
                    loose_games: gamesLoose,
                    percent_wins: gameWinPercent
        };
        return stats;	//return the result back
    }else{
        return null;
    }

}

function getDom() {
	getData();
	var self = this;
	console.log(stats)
	console.log(this.stats)
	if (null == stats) {
		var wrapper = document.createElement("div");
		var labelDataRequest = document.createElement("label");
		labelDataRequest.innerHTML = 'Loading stats...';//this.translate("TITLE");
		wrapper.appendChild(labelDataRequest);
	} else {
		var wrapper = document.createElement('table');
		wrapper.className = 'js-sort-table table';

		let headerRow = document.createElement('tr');
		headerRow.className = 'row header';
		this.createTableCell(headerRow, "Name", true, 'username-header cell js-sort-string', 'username-header'); 	//this.translate('USER_NAME'), true, 'username-header', true);
		this.createTableCell(headerRow, "Ranking", true, 'ranking-header cell js-sort-number', 'ranking-header');		//this.translate('SCORE'), this.config.showScore, 'score-header');
		this.createTableCell(headerRow, "ELO", true, 'elo-header cell js-sort-number', 'elo');			//this.translate('MATCHES_PLAYED'), this.config.showMatchesPlayed, 'matches-played-header');
		this.createTableCell(headerRow, "Highest ELO", true, 'helo-header cell js-sort-number', 'highest-elo');	//this.translate('KILLS'), this.config.showKills, 'kills-header');
		this.createTableCell(headerRow, "Win rate [%]", true, 'win-percent cell js-sort-number', 'win-rate');
		this.createTableCell(headerRow, "Total games", true, 'game-wins cell js-sort-number', 'total-games');
		this.createTableCell(headerRow, "Wins", true, 'game-losses cell js-sort-number', 'wins');
		this.createTableCell(headerRow, "Losses", true, 'game-total cell js-sort-number', 'losses');
		wrapper.appendChild(headerRow);

		let tableBody = document.createElement('tbody');
		for (let i = 0; i < stats.length; ++i) {
			let row = document.createElement('tr');
			row.className = 'row';
			const stat = stats[i];
			console.log("Stat:", stat);
			this.createTableCell(row, stat.name, true, 'username cell', 'Username');
			this.createNumberTableCell(row, stat.ranking, true, 'ranking cell', 'Ranking');
			this.createNumberTableCell(row, stat.elo, true, 'ELO cell', 'ELO');
			this.createNumberTableCell(row, stat.high_elo, true, 'Max. ELO cell', 'Highest ELO');
			this.createNumberTableCell(row, stat.percent_wins, true, 'Win rate cell', 'Win rate[%]');
			this.createNumberTableCell(row, stat.total_games, true, 'Win rate cell', 'Total games');
			this.createNumberTableCell(row, stat.won_games, true, 'Win rate cell', 'Wins');
			this.createNumberTableCell(row, stat.loose_games, true, 'Win rate cell', 'Losses');
			tableBody.appendChild(row);
		}
		wrapper.appendChild(tableBody)
	}
	document.getElementById("wrap-table100").appendChild(wrapper);
}


// Creates a table row cell.
// @param row - The table row to add cell to.
// @param number - The number to show.
// @param show - Whether to actually show.
function createNumberTableCell(row, number, show, className, id) {
	if (!show)
		return;

	const text = new Intl.NumberFormat().format(number);
	this.createTableCell(row, text, show, className, id);
}

// Creates a table row cell.
// @param row - The table row to add cell to.
// @param text - The text to show.
// @param show - Whether to actually show.
// @param leftAlign - True to left align text. False to center align.
function createTableCell(row, text, show, className, id) {
	if (!show)
		return;
	let cell = document.createElement('td');
	cell.innerHTML = text;
	cell.className = className;
	cell.id = id;
	row.appendChild(cell);
}

window.onload=function(){
	document.getElementById("ranking-header").click();
  };
getDom();