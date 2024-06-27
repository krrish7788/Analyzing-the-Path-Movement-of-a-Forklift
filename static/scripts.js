document.getElementById('username').value = 'krrish';
document.getElementById('password').value = '1000';
document.getElementById('project-title').value = 'project 1';
document.getElementById('unit').value = 15;
document.getElementById('stop-name').value = 'stop point 1';
document.getElementById('duration').value = 20000;


document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Simple login validation
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('project-page').style.display = 'block';
        document.getElementById("welcome_message").innerHTML = "Welcome " + document.getElementById('username').value;
    } else {
        alert('Please enter both username and password.');
    }
});

document.getElementById('project-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectTitle = document.getElementById('project-title').value;
    const backgroundImage = document.getElementById('background-image').files[0];
    const dataFile = document.getElementById('data-file').files[0];
    const unit = document.getElementById('unit').value;
    const duration = 0;

    if (projectTitle && backgroundImage && dataFile && unit) {
        handleFileUpload(dataFile, backgroundImage, unit, duration);
        document.getElementById('add_stop_point').style.display = 'block';
    } else {
        alert('Please fill all fields and upload the necessary files.');
    }
});

document.getElementById('add_stop_point').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectTitle = document.getElementById('project-title').value;
    const backgroundImage = document.getElementById('background-image').files[0];
    const dataFile = document.getElementById('data-file').files[0];
    const unit = document.getElementById('unit').value;

    const stopName = document.getElementById('stop-name').value;
    const duration = document.getElementById('duration').value;

    if (projectTitle && backgroundImage && dataFile && unit && stopName && duration) {
        handleFileUpload(dataFile, backgroundImage, unit, duration, stopName);
    } else {
        alert('Please fill all fields');
    }
});

function handleFileUpload(dataFile, backgroundImage, unit, duration, stopName) {

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const tmpParsedData = parseCSV(csvData);

        if (duration == 0) {
            drawSpaghettiDiagram(tmpParsedData, backgroundImage, unit);
        } else {
            const maxDuration = Number(tmpParsedData[0].timestamp) + Number(duration);
            const parsedData = tmpParsedData.filter(item => item.timestamp <= maxDuration);
            document.getElementById("stop_point_info").style.marginTop = "30px"
            document.getElementById("stop_point_info").innerHTML = "T: " + stopName + ", D: " + duration +
            "<br>" + "Start Point: " + parsedData[0].timestamp + "<br>" + "End Point: " + parsedData[parsedData.length - 2].timestamp;
            drawSpaghettiDiagram(parsedData, backgroundImage, unit);
        }
    };
    reader.readAsText(dataFile);
}

function parseCSV(data) {
    const lines = data.split('\n');
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].split(',');
        result.push({
            timestamp: line[0],
            deviceID: line[3],
            x: parseFloat(line[4]),
            y: parseFloat(line[5])
        });
    }
    return result;
}

function drawSpaghettiDiagram(data, backgroundImage, unit) {

    const canvas = document.getElementById('spaghetti-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(backgroundImage);

    img.onload = function() {
        canvas.width = img.width / 2;
        canvas.height = img.height / 2;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = (canvas.width / 2) + (point.x * unit);
            const y = (canvas.height / 2) - (point.y * unit);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    };
}
