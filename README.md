# tini-pong

```md
project : ft_transcendence
Circle : 6
Language : html/css/js python
Type : group(5)
introduce :
- 구성
	- frontend : vanilla JS Three.js WebSocket
	- backend : Django (python) channels
	- DB : postgresSQL
- 요구 조건
	- 필수
		- SPA
		- Pong game
			- 1 vs 1
			- tournament
	- 선택
		- 3d pong game
		- multi user
```


```md
history : ft_transcendence

(팀 시작) : 2024.02.14
(팀 참가) : 2024.02.16 - 나는 이날 합류함 (프론트엔드)
(기초 학습) : ~ 2024.02.21 - 역할에 맞춰 각자 기본적인 언어, 라이브러리, 프레임워크 학습
(기획) : 2024.02.22 ~ 02.29
	- 내 역할 : pong game
(개발) : 2024.03.01 ~ 04.16
<!-- 1~3일 3일간 심한 감기에 걸려 앓아누웠음 -->
	- local pong game
		- start : 2024.03.04
		- threeJS 배우기
		- Key event 처리 : 2024.03.15
		- local pong game 제작 완료 : 2024.03.19
	-  remote pong game
		- pong game이 렌더링되는 위치 고민
		- websocket 학습 2024.03.24 ~ 2024.03.29
		- 제작 및 마무리
finish(125) : 2024.04.16
```

1차적으로 html/css/js에 대해서 각자 알아서 학습하자고 진행되었는데 막상 프로젝트 요구조건 분석하니 SPA가 필요했고 프론트엔드 인원이 3명이라 각자 라우터 및 여러 페이지 담당 / pong 게임 담당 / 추가 기능 담당으로 분리해서 진행. 

pong게임이 사실 타자로 코딩한게 아니라 그 원론적인 코딩이라는건 좀 많이 신기했음.

pong 게임이 뭔지 내가 뭘 판단시켜야하는지 먼저 분석해서 대충 임의의 사이트에서 canvas로 구현했는데 SPA에 적용은 다른 문제더라.

일단 요구조건과 추가점수 조건에 따라 offline pong game을 기반으로 1vs1, 2vs2, tournament 구현을 함. 이게 위에서 말한 local pong game 제작 완료임.

근데 js로 열심히 만들고났더니 그럼 서버쪽에서 판단하는게 아니네? 그래서 서버에서 검증을 해줘야할지, 한다면 어떻게 해야할지 만약 서버에서 돌릴거면 파이썬으로 1초를 60번으로 나눠서 호출하는게 되겠고 js에서라면 request animation frame을 쓰면 되겠지? 근데 이제 평가 자체가 클러스터의 아이맥으로 동일하고 우리가 제대로 배포하는게 아니라 클러스터의 인트라넷 기준으로 배포하는 프로젝트다보니 front에서 렌더링하고 서버는 사실상 event 전달만 해주는 구조가 훨씬 성능적으로 좋다는 점과 이게 딱히 돈 들여서 기록 남겨야하는 그런 종류의 게임도 아니고 애초에 이 게임은 지인끼리 혹은 랜덤으로 만난 사람끼리 즐겁게 하는게 목표라는점과 그시절 굉장히 뜨거운 메이플스토리도 서버 검증 없이 운영중이라는 핑?계도 있어서 클라이언트 중 왼쪽 플레이어 기준으로 렌더링하게 제작하기로 함
