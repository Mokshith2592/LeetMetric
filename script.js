document.addEventListener("DOMContentLoaded" ,function() {
    const searchButton = document.getElementById("search");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);

        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function displayUserData(data){
        const totalQues = data.totalQuestions;
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const totalSolved = data.totalSolved;
        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        updateProgress(easySolved ,totalEasyQues ,easyLabel ,easyProgressCircle);
        updateProgress(mediumSolved ,totalMediumQues ,mediumLabel ,mediumProgressCircle);
        updateProgress(hardSolved ,totalHardQues ,hardLabel ,hardProgressCircle);

        const acceptanceRate = data.acceptanceRate;
        const ranking = data.ranking;
        const contributionPoints = data.contributionPoints;
        const reputation = data.reputation;
        const cardData = [
            {
                label:"acceptanceRate",
                value:acceptanceRate
            },
            {
                label:"ranking",
                value:ranking
            },
            {
                label:"contributionPoints",
                value:contributionPoints
            },
            {
                label:"reputation",
                value:reputation
            }
        ];

        // console.log(cardData);
        cardStatsContainer.innerHTML = cardData.map((data) => {
            return `
                    <div class="card">
                        <h4>${data.label}:</h4>
                        <p>${data.value}</p>
                    </div>
                    `
        }).join("");
    }

    function updateProgress(solved ,total ,label ,circle){
        const progress = (solved*100)/total;
        circle.style.setProperty("--progress-degree",`${progress}%`);
        label .textContent = `${solved}/${total}`
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            statsContainer.style.setProperty("display","none");
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error("Unable to fetch the User Details");
            }   
            const data = await response.json();
            console.log(data);
            statsContainer.style.setProperty("display","block");

            displayUserData(data);
        }
        catch(error) {
            statsContainer.innerHTML = `<p>${error}</p>`
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click' ,function(){
        const username = usernameInput.value;
        console.log(username);

        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})