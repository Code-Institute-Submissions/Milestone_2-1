$(function () {
    function changeSettings() {

    }

    $("#rules-dialog").dialog({
        autoOpen: false,
        // modal: true,
        position: { my: "left top", at: "left bottom+64", of: '#rules-btn' }
    });

    $("#options-dialog").dialog({
        autoOpen: false,
        // modal: true,
        position: { my: "right top", at: "right bottom+64", of: '#settings-btn' },
        buttons: {
            "Apply Settings": changeSettings,
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            document.getElementById('settings-form').reset();

        }
    });

    $("#win-dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Play Again": function () {
                myGame = null;
                myGame = new Game();
                myGame.startGame();
                $(this).dialog("close");
            }
        }
    });

    $("#rules-btn").on("click", function () {
        if (!$("#rules-dialog").dialog("isOpen")) {
            $("#rules-dialog").dialog("open");
        } else {
            $("#rules-dialog").dialog("close");
        }
    });

    $("#settings-btn").on("click", function () {
        if (!$("#options-dialog").dialog("isOpen")) {
            $("#options-dialog").dialog("open");
        } else {
            $("#options-dialog").dialog("close");
        }
    });

});
