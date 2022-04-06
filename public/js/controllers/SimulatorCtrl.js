/**
 * SinulatorCtrl.js
 * A controller for the simulator.html page
 */

/** Declare some global variables just so they don't go out of scope **/
var globalMainWindow, globalSideWindow, globalGrid;

/** Create a new AngularJS module and attach a controller */
angular.module('SimulatorCtrl', ['WindowModule'])
    /** On page load */
    .controller('SimulatorController', function($scope, $window) {
        $scope.tagline = 'Welcome to Simulator section!';
        // Attach the keydown event
        document.onkeydown = onKeyPress;
        // Grab the DOM elements and create Windows with them
        globalMainWindow = document.querySelectorAll('[name="MainWindow"]')[0];
        globalSideWindow = document.querySelectorAll('[name="SideWindow"]')[0];
        globalMainWindow = new Window(globalMainWindow, new SinglePlacement());
        globalSideWindow = new Window(globalSideWindow, new SortedListPlacement(null, 100));
        // Make the grid
        globalGrid = new GridDisplay();
        globalMainWindow.addDisplay(globalGrid);
        // Add the 'Add' button to the globalSideWindow
        globalSideWindow.addDisplay(new AddTokenDisplay());
    });

function Edit() {
    console.log("Edit");
}

function onKeyPress(event) {
    globalMainWindow.onKeyPress(event)
    globalSideWindow.onKeyPress(event)
}

function Reset() {
    console.log("Reset");
}

function Back() {
    console.log("Back");
}

function Play() {
    document.getElementById('log').innerHTML += "Play\n";
    console.log("Play");
    sim = new Simulator(globalGrid, null);
    console.log(sim);

    let initiative = [];
    globalSideWindow.displays.forEach((display) => {
        if (display.token !== undefined) {
            initiative.push(display.token);
        }
    });
    sim._forward(initiative);
    sim.updateDisplay();
}

function Forward() {
    console.log("Forward");
}

function Settings() {
    console.log("Settings");
}

function Import() {
    console.log("Import");
}

function Log() {
    // Hide log button
    document.getElementById('log-button').style.display = "none";
    document.getElementById('back-button').style.display = "inline";
    document.getElementById('log').style.display = "block";
    // Hide the initiative
    globalSideWindow.displays.forEach((display) => {
        globalSideWindow.placement.deactivateDisplay(display, globalSideWindow.displays);
    });
}

function Back() {
    // Hide log button
    document.getElementById('log-button').style.display = "inline";
    document.getElementById('back-button').style.display = "none";
    document.getElementById('log').style.display = "none";
    // Show the initiative
    globalSideWindow.displays.forEach((display) => {
        globalSideWindow.placement.activateDisplay(globalSideWindow.dom, display, globalSideWindow.displays);
    })
}