import animateGame from "../utils/animateGameModule.js";

let
document = window.document,
THREE = window.THREE,
num = null,

ARROW_UP = 38,
ARROW_DOWN = 40,

isArrowUpKeyDown = false,
isArrowDownKeyDown = false,

WIDTH = 1200,
HEIGHT = 900,

CAMERA_LOCATION_X = 1000,
CAMERA_LOCATION_Y = 3000,
CAMERA_LOCATION_Z = 0,
CAMERA_LOOKAT_X = 0,
CAMERA_LOOKAT_Y = 0,
CAMERA_LOOKAT_Z = 0,
CAMERA_FOV = 45,
CAMERA_ASPECT = WIDTH / HEIGHT,
CAMERA_NEAR = 0.1,
CAMERA_FAR = 10000,

LIGHT_LOCATION_X = 0,
LIGHT_LOCATION_Y = 100,
LIGHT_LOCATION_Z = 0,
LIGHT_COLOR = 0xffffff,

BOARD_WIDTH = 1400,
BOARD_HEIGHT = 10,
BOARD_LENGTH = 3000,
BOARD_LOCATION_X = 0,
BOARD_LOCATION_Y = -50,
BOARD_LOCATION_Z = 0,
BOARD_COLOR = 0x4D37C6,

BALL_DEFAULT_VELOCITY_Z = 20,
BALL_RADIUS = 20,
BALL_VELOCITY_X = 0,
BALL_VELOCITY_Z = BALL_DEFAULT_VELOCITY_Z,
BALL_LOCATION_X = 0,
BALL_LOCATION_Y = 0,
BALL_LOCATION_Z = 0,
BALL_COLOR = 0xFFC85D,

PADDLE_DEFAULT_WIDTH = 200,
PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH,
PADDLE_HEIGHT = 30,
PADDLE_LENGTH = 30,
PADDLE_LOCATION_X = 0,
PADDLE_LOCATION_Y = 0,
PADDLE_LOCATION_Z = 0,
PADDLE_COLOR = 0xD30D5C,
PADDLE_SPEAD = 10,

container,
renderer,
mainLight,
camera,
scene,
board,
ball,
paddle1,
paddle2,
last_scored_player = null,

paddle1_spead = 0,
paddle2_spead = 0,

difficulty = 0,

game = false,
end = false,

start_date,

nick1,
nick2,
nick3,
nick4,

round,

player1,
player2,
player1_num,
player2_num,
round1Winner,
round1Winner_num,
round2Winner,
round2Winner_num,

player_number = null,

p1nickBoard,
scoreBoard,
p2nickBoard,

score = {
  player1: 0,
  player2: 0
};

let tournamentResults = [];
let tournamentGamesPlayed = 0;
const totalTournamentGames = 3;

function init(d, pn1, pn2, pn3, pn4)
{
  if (num)
    cancelAnimationFrame(num);
  setGameStatus(d, pn1, pn2, pn3, pn4);
  setScoreBoard();
  setGame();
  setDifficulty()
  setEvent();
  const dataToSend = {
    "action": "init",
  }
  window.websocket.send(JSON.stringify(dataToSend));
  start_date = Date();
  animateGame.setAnimateOn();
  loop();
}

function setGameStatus(d, pn1, pn2, pn3, pn4)
{
  difficulty = d;
  round = 1;
  nick1 = pn1;
  nick2 = pn2;
  nick3 = pn3;
  nick4 = pn4;
  player1 = nick1;
  player2 = nick2;
  player1_num = 1;
  player2_num = 2;
  game = false;
  end = false;
  PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH;
  paddle1_spead = 0;
  paddle2_spead = 0;
  score = {
    player1: 0,
    player2: 0
  };
}

function setScoreBoard()
{
  scoreBoard = document.querySelector('#scoreBoard');
  p1nickBoard = document.querySelector('#p1nickBoard');
  p2nickBoard = document.querySelector('#p2nickBoard');
  p1nickBoard.style.display = 'none';
  p1nickBoard.style.textAlign = 'left';
  p2nickBoard.style.display = 'none';
  p2nickBoard.style.textAlign = 'right';
  scoreBoard.innerHTML = 'Round 1! Press the key to start! ' + player1 + ' vs ' + player2 + '(up,down)';
}

function setGame()
{
  setRenderer();
  setScene();
  setLight();
  setCamera();
  setBoard();
  setBall();
  setPaddle();
}

function setRenderer()
{
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xffffff, 1);
  container.appendChild(renderer.domElement);
}

function setScene()
{
  scene = new THREE.Scene();
}

function setLight()
{
  mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
  scene.add(mainLight);
}

function setCamera()
{
  camera = new THREE.PerspectiveCamera(CAMERA_FOV, CAMERA_ASPECT, CAMERA_NEAR, CAMERA_FAR);
  camera.position.set(CAMERA_LOCATION_X, CAMERA_LOCATION_Y, CAMERA_LOCATION_Z);
  camera.lookAt(CAMERA_LOOKAT_X,CAMERA_LOOKAT_Y,CAMERA_LOOKAT_Z);
  scene.add(camera);
}

function setBoard()
{
  let boardGeometry = new THREE.BoxGeometry(BOARD_WIDTH, BOARD_HEIGHT, BOARD_LENGTH),
      boardMaterial = new THREE.MeshLambertMaterial({ color: BOARD_COLOR });
  board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.set(BOARD_LOCATION_X, BOARD_LOCATION_Y, BOARD_LOCATION_Z);
  scene.add(board);
}

function setBall()
{
  let ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
      ballMaterial = new THREE.MeshLambertMaterial({ color: BALL_COLOR });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(BALL_LOCATION_X, BALL_LOCATION_Y, BALL_LOCATION_Z)
  scene.add(ball);
}

function setPaddle()
{
  paddle1 = addPaddle();
  paddle1.position.z = BOARD_LENGTH / 2 - PADDLE_LENGTH;
  paddle2 = addPaddle();
  paddle2.position.z = -BOARD_LENGTH / 2 + PADDLE_LENGTH;
}

function addPaddle()
{
  let paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_LENGTH),
      paddleMaterial = new THREE.MeshLambertMaterial({ color: PADDLE_COLOR }),
      paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  scene.add(paddle);
  return paddle;
}

function setDifficulty()
{
  if (difficulty === 1)
  {
    BALL_VELOCITY_Z *= 0.8;
    PADDLE_WIDTH *= 1.2;
    paddle1.scale.set(1.2, 1, 1);
    paddle2.scale.set(1.2, 1, 1);
  }
  else if (difficulty === 2)
  {
    BALL_VELOCITY_Z = BALL_DEFAULT_VELOCITY_Z;
  }
  else if (difficulty === 3)
  {
    BALL_VELOCITY_Z *= 1.2;
    PADDLE_WIDTH *= 0.8;
    paddle1.scale.set(0.8, 1, 1);
    paddle2.scale.set(0.8, 1, 1);
  }
}

function setEvent()
{
  document.addEventListener('keydown', onlineContainerEventKeyDown);
  document.addEventListener('keyup', onlineContainerEventKeyUp);

  window.websocket.onclose = function (event) {
    window.websocket = undefined;
    if (game === true)
      console.log('게임 진행 도중 WebSocket 연결이 닫혔습니다.');
    else if (end === true)
      console.log('게임 종료 이후 WebSocket 연결이 닫혔습니다.');
    else
      console.log('게임 시작 직전 WebSocket 연결이 닫혔습니다.');
    end = true;
  };

  window.websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    
    if (data["type"] === "init")
      player_number = data["player_number"];

    if (data["type"] === "win")
    {
      let win_player = data["msg"]["winner"]
      let win_player_number = data["msg"]["winner_number"]
      score.player1 = data["msg"]["score_p1"]
      score.player2 = data["msg"]["score_p2"]
      p1nickBoard.innerHTML = '';
      p1nickBoard.style.display = "none";
      p2nickBoard.innerHTML = '';
      p2nickBoard.style.display = "none";
      scoreBoard.innerHTML = win_player + ' Win! ' + player1 + ':' + score.player1 + ", " + player2 + ' : ' + score.player2;
      stopBall();
      let roundText = 'Round 1';
      if (round === 2)
        roundText = 'Round 2';
      if (round === 3)
        roundText = 'Final round';
      scoreBoard.innerHTML = win_player + ' Win! [n] to next round';
      addResult(roundText + ' : ' + win_player + ' Win! ' + player1 + ':' + score.player1 + ", " + player2 + ' : ' + score.player2);
      if (round === 1)
      {
        round = 2;
        round1Winner = win_player;
        round1Winner_num = win_player_number;
        player1 = nick3;
        player2 = nick4;
        player1_num = 3;
        player2_num = 4;
        // 만약 필요하다면 roune 1 결과 전송
      }
      else if (round === 2)
      {
        round = 3;
        round2Winner = win_player;
        round2Winner_num = win_player_number;
        player1 = round1Winner;
        player1_num = round1Winner_num;
        player2 = round2Winner;
        player2_num = round2Winner_num;
        // 만약 필요하다면 roune 2 결과 전송
      }
      else if (round === 3)
      {
        // 이벤트 제거
        document.removeEventListener('keydown', onlineonlineContainerEventKeyDown);
        document.removeEventListener('keyup', onlineonlineContainerEventKeyUp);
        // 결과를 잘 정리해서 socket을 통해 JSON으로 전송
      }
      end = true;
    }

    if (data["type"] === "scored")
    {
      last_winner = data["msg"]["scored_p"]
      score.player1 = data["msg"]["score_p1"]
      score.player2 = data["msg"]["score_p2"]
      p1nickBoard.innerHTML = player1;
      p1nickBoard.style.display = "block";
      scoreBoard.innerHTML = score.player1 + ' : ' + score.player2;
      scoreBoard.style.fontWeight = "bold";
      p2nickBoard.innerHTML = player2;
      p2nickBoard.style.display = "block";
      stopBall();
    }

    if (player_number !== player1_num && data["type"] === "sync")
    {
      // 공 위치, 속도 동기화
      ball.position.x = data["obj"]["ball_loc"].x;
      ball.position.z = data["obj"]["ball_loc"].z;
      paddle1.position.x = (data["obj"]).paddle1_loc;
      paddle2.position.x = (data["obj"]).paddle2_loc;
    }

    if (end == true)
    {
      let roundText;
      if (round === 2)
        roundText = 'Round 2!';
      if (round === 3)
        roundText = 'Final round!';
      scoreBoard.innerHTML = roundText + ' Press the key to start! ' + player1 + ' ' + player2 + '(up,down)';
      score = {
        player1: 0,
        player2: 0
      };
      paddle1.position.x = 0;
      paddle2.position.x = 0;
      paddle1_spead = 0;
      paddle2_spead = 0;
      end = false;
      loop();
    }
    else if (data["type"] === "key_press")
    {
      if (data["player_number"] === player1_num)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle1_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle1_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle1_spead === -PADDLE_SPEAD)
              paddle1_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle1_spead === PADDLE_SPEAD)
              paddle1_spead = 0;
          }
        }
      }
      else if (data["player_number"] === player2_num)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle2_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle2_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle2_spead === -PADDLE_SPEAD)
              paddle2_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle2_spead === PADDLE_SPEAD)
              paddle2_spead = 0;
          }
        }
      }
      else
        return;
      if (end === false)
      {
        game = true;
      }
    }
  };
}

function onlineContainerEventKeyDown(e)
{
  if (isArrowUpKeyDown === false && e.keyCode === ARROW_UP)
  {
    isArrowUpKeyDown = true;
    // send key down arrow up
    const dataToSend = {
      "action": "key_press",
      "event": "keydown",
      "key": ARROW_UP,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else if (isArrowDownKeyDown === false && e.keyCode === ARROW_DOWN)
  {
    isArrowDownKeyDown = true;
    // send key down arrow down
    const dataToSend = {
      "action": "key_press",
      "event": "keydown",
      "key": ARROW_DOWN,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else
    return ;
}

function onlineContainerEventKeyUp(e)
{
  if (isArrowUpKeyDown === true && e.keyCode === ARROW_UP)
  {
    isArrowUpKeyDown = false;
    // send key up arrow up
    const dataToSend = {
      "action": "key_press",
      "event": "keyup",
      "key": ARROW_UP,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else if (isArrowDownKeyDown === true && e.keyCode === ARROW_DOWN)
  {
    isArrowDownKeyDown = false;
    // send key up arrow down
    const dataToSend = {
      "action": "key_press",
      "event": "keyup",
      "key": ARROW_DOWN,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
}

function addResult(res)
{
  const resultDiv = document.querySelector("#result");
  resultDiv.style.display = 'block';
  resultDiv.style.margin = '10px';
  resultDiv.innerHTML = `
        <br><br>
        <h2>Game result</h2>
        <p>local game does not save a result in server</p>
        <h3><b>left</b> vs <b>right</b></h3>
        <div id="resultT"></div>`
  const resultBoard = resultDiv.querySelector('#resultT');
  const result = document.createElement('div');
  result.textContent = res;
  resultBoard.appendChild(result);
}

function loop()
{
  num = requestAnimationFrame(loop);
  if (game === true && end === false)
    simulation_ball();
  simulation_paddle();
  if (animateGame.getAnimate() === false)
    end = true;
  if (end === true)
  {
    stopBall();
    cancelAnimationFrame(num);
    num = null;
  }
  if (player_number === player1_num)
  {
    const dataToSend = {
      "action": "sync",
      "obj": {
        "ball_loc": ball.position,
        "paddle1_loc": paddle1.position.x,
        "paddle2_loc": paddle2.position.x,
      }
    }
    window.websocket.send(JSON.stringify(dataToSend));
  }
  renderer.render(scene, camera);
}

function simulation_ball()
{
  if(game === true) {
    if(ball.$velocity == null) {
      startOneGame();
    }
    
    updateBallPosition();
    
    if(isSideCollision()) {
      ball.$velocity.x *= -1; 
    }
    
    if(isPaddle1Collision()) {
      hitBallBack(paddle1);
    }
    
    if(isPaddle2Collision()) {
      hitBallBack(paddle2);
    }
    
    if(isPastPaddle1()) {
      scoreBy('player2');
    }
    
    if(isPastPaddle2()) {
      scoreBy('player1');
    }
  }
}

function startOneGame()
{
  let direction = 1;
  if (last_scored_player === null)
    direction = Math.random() > 0.5 ? -1 : 1;
  else if (last_scored_player === 'player1')
    direction = -1;
  else
    direction = 1;
  ball.$velocity = {
    x: BALL_VELOCITY_X,
    z: direction * BALL_VELOCITY_Z
  };
}

function updateBallPosition()
{
  if (!isNaN(ball.$velocity.x))
    ball.position.x += ball.$velocity.x;
  if (!isNaN(ball.$velocity.z))
    ball.position.z += ball.$velocity.z;
}

function isSideCollision()
{
  let halfBoardWidth = BOARD_WIDTH / 2;
  return ball.position.x - BALL_RADIUS < -halfBoardWidth || ball.position.x + BALL_RADIUS > halfBoardWidth;
}

function isPaddle1Collision()
{
  return ball.position.z + BALL_RADIUS >= paddle1.position.z && isBallAlignedWithPaddle(paddle1);
}

function isPaddle2Collision()
{
  return ball.position.z - BALL_RADIUS <= paddle2.position.z && isBallAlignedWithPaddle(paddle2);
}

function isBallAlignedWithPaddle(paddle)
{
  let halfPaddleWidth = PADDLE_WIDTH / 2
  return ball.position.x > paddle.position.x - halfPaddleWidth && ball.position.x < paddle.position.x + halfPaddleWidth;
}

function hitBallBack(paddle)
{
  ball.$velocity.x = (ball.position.x - paddle.position.x) / 5; 
  ball.$velocity.z *= -1;
}

function isPastPaddle1()
{
  return ball.position.z > paddle1.position.z + PADDLE_LENGTH;
}

function isPastPaddle2()
{
  return ball.position.z < paddle2.position.z - PADDLE_LENGTH;
}

function scoreBy(playerName)
{
  addPoint(playerName);
  last_scored_player = playerName;
  stopBall();
  updateScoreBoard(playerName);
}

function updateScoreBoard(playerName)
{
  end = true;
  if (score.player1 === 5 || score.player2 === 5) {
    const winner = score.player1 === 5 ? player1 : player2;
    const loser = score.player1 === 5 ? player2 : player1;
    const winner_number = score.player1 === 5 ? player1 : player2;
    tournamentGamesPlayed++;
    const gameResult = {
      "date": start_date,
      "round": round,
      "winner": winner,
      "loser": loser,
      "index": tournamentGamesPlayed,
      "score_p1": score.player1,
      "score_p2": score.player2,
    };
    tournamentResults.push(gameResult);

    if (checkTournamentEnd()) {
      const dataToSend = {
        "action": "tournament_end",
        "tournamentResults": tournamentResults,
      };
      window.websocket.send(JSON.stringify(dataToSend));
    }

    const dataToSend = {
      "action": "win",
      "msg": {
        "winner": winner,
        "winner_number": winner_number,
        "score_p1": score.player1,
        "score_p2": score.player2,
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
  }
  else
  {
    const dataToSend = {
      "action": "scored",
      "msg": {
        "scored_p": playerName,
        "score_p1": score.player1,
        "score_p2": score.player2,
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    end = false;
  }
}

function checkTournamentEnd() {
  return tournamentGamesPlayed === totalTournamentGames;
}

function stopBall()
{
  ball.position.set(0,0,0);
  ball.$velocity = null;
  game = false;
}

function addPoint(playerName)
{
  score[playerName]++;
  console.log(score);
}

function simulation_paddle()
{
  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle1.position.x + paddle1_spead && paddle1.position.x + paddle1_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle1.position.x += paddle1_spead;

  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle2.position.x + paddle2_spead && paddle2.position.x + paddle2_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle2.position.x += paddle2_spead;
}

export { init, onlineContainerEventKeyUp, onlineContainerEventKeyDown }