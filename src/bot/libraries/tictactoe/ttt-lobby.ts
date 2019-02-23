import { Message, GuildMember, Guild, TextChannel, DMChannel, GroupDMChannel, Role } from 'discord.js';
import { TTTBoard, boardEnums } from '@bot/libraries/tictactoe/ttt-board';
const CenterX = 1;
const CenterY = 1;

module tttEnums {
    export enum TurnEnum {
        Searching = 0,
        Player1 = 1,
        Player2 = 2,
        Complete = 3
    }

    export enum rowColumnEnum {
        A = 0,
        B = 1,
        C = 2
    }
}

export class TTTLobby {
    private currentTurn : tttEnums.TurnEnum;
    private player1 : GuildMember | null;
    private player2 : GuildMember | null;

    private board : TTTBoard;
    private player1Space : boardEnums.SpaceEnum;
    private player2Space : boardEnums.SpaceEnum;

    private lobbyChannel : TextChannel | DMChannel | GroupDMChannel;
    private lobbyServer : Guild;

    private rowString : string;
    private colString : string;

    constructor (server: Guild, channel: TextChannel | DMChannel | GroupDMChannel, player1: GuildMember | null = null, player2: GuildMember | null = null){
        this.currentTurn = tttEnums.TurnEnum.Searching;
        this.player1 = player1;
        this.player2 = player2;

        this.board = new TTTBoard();
        this.player1Space = boardEnums.SpaceEnum.X;
        this.player2Space = boardEnums.SpaceEnum.O;

        this.lobbyChannel = channel;
        this.lobbyServer = server;

        this.rowString = `${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.A]}` 
                  + `${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.B]}`
                  + `$${tttEnums.rowColumnEnum[tttEnums.rowColumnEnum.C]}`;
        
        this.colString = `${tttEnums.rowColumnEnum.A}`
                       + `${tttEnums.rowColumnEnum.B}`
                       + `${tttEnums.rowColumnEnum.C}`;
    }

    AddPlayer(player: GuildMember){
        if (this.player1 === null){
            this.player1 = player;
        }
        else if(this.player2 === null){
            this.player2 = player;
        }
        else{
            return "Lobby is full.";
        }

        return "Successfully added player";
    }

    BeginTheGame(){
        this.currentTurn = /*lodash*/_.random(tttEnums.TurnEnum.Player1, tttEnums.TurnEnum.Player2);
        console.log(this.colString + " " + this.rowString);
        this.GameLoop();
    }

    GameLoop(){
        this.lobbyChannel.send(this.board.GetBoardVisual());

        let playerWithTurn = this.GetPlayerWithTurn();
        let playerSpaceIcon = this.GetPlayerWithTurnSpaceIcon();
        if (typeof playerWithTurn !== null)
        {
            //No VS Code it CANT be null, I checked.
            this.lobbyChannel.send(`\n${playerWithTurn.displayName}'s turn`);
        }

        let winner = this.board.CheckForWinner();

        if (winner === this.player1Space){
            this.lobbyChannel.send(`${this.player1} wins`);
            return;
        }
        if (winner === this.player2Space){
            this.lobbyChannel.send(`${this.player2} wins`);
            return;
        }
        if (winner !== null){
            this.lobbyChannel.send(`A tie, as per usual`);
            return;
        }

        let coordinateRegex = new RegExp('([' + this.rowString + this.colString + '])', "g");
        const filter = (message : Message) => message.member === playerWithTurn
                                && coordinateRegex.test(message.content);
        const collector = this.lobbyChannel.createMessageCollector(filter);


        let successfullyChangedTile = false;
        let self = this;
        collector.once('collect', function(message){
            let verticalInput : string | null = null;
            let verticalRegex = new RegExp('([' + self.colString + '])')
            if (verticalRegex.test(message.content)){
                verticalInput = String(message.content.match(verticalRegex));
            }

            let horizontalInput : string | null = null;
            let horizontalRegex = new RegExp('([' + self.rowString + '])')
            if (horizontalRegex.test(message.content)) {
                horizontalInput = String(message.content.match(horizontalRegex));
            }

            let x : number = 1;
            let y: number = 1;

            if (verticalInput !== null && !isNaN(Number(verticalInput))){
                y = Number(verticalInput) - 1;
            }

            //TODO: figure out a better way to do this
            if (horizontalInput !== null){
                if (horizontalInput === "A"){
                    x = tttEnums.rowColumnEnum.A;
                }
                else if (horizontalInput === "B"){
                    x = tttEnums.rowColumnEnum.B;
                }
                else if (horizontalInput === "C"){
                    x = tttEnums.rowColumnEnum.C;
                }
            }

            console.log(`${x} ${y}`);

            successfullyChangedTile = self.board.ChangeTile(x, y, playerSpaceIcon);

            if (successfullyChangedTile){
                //flips player turn

                self.currentTurn = (self.currentTurn === tttEnums.TurnEnum.Player1
                    ? tttEnums.TurnEnum.Player2 : tttEnums.TurnEnum.Player1);
            }

            self.GameLoop();
        });
    }

    GetLobbyChannel() : TextChannel | DMChannel | GroupDMChannel {
        return this.lobbyChannel;
    }
    
    GetLobbyServer() : Guild {
        return this.lobbyServer;
    }

    GetPlayer(playerNumber : number) : GuildMember | null {
        console.log(this.player1 + " " + this.player2);
        if (playerNumber === 1){
            return this.player1;
        }
        if (playerNumber === 2){
            return this.player2;
        }

        return null;
    }

    GetPlayerWithTurn() : GuildMember | null {
        let playerWithTurn : GuildMember | null = null;
        if (this.currentTurn === tttEnums.TurnEnum.Player1) {
            playerWithTurn = this.player1;
        }
        else /*if (this.currentTurn === tttEnums.TurnEnum.Player2)*/ {
            playerWithTurn = this.player2;
        }
        return playerWithTurn;
    }

    GetPlayerWithTurnSpaceIcon() : boardEnums.SpaceEnum | undefined {
        let xo;
        if (this.currentTurn === tttEnums.TurnEnum.Player1) {
            xo = this.player1Space;
        }
        else if (this.currentTurn === tttEnums.TurnEnum.Player2) {
            xo = this.player2Space;
        }
        return xo;
    }
}