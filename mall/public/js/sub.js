//jquery
$(function () {
  //로그인 유무 확인
  getToken();

  $(".nav-user").click(function () {
    // 로그인 상태인지 확인하여 분기 처리 필요(지금은 무조건 로그인 페이지로 이동)
    if (localStorage.getItem("token")) {
      // 로그인 상태 처리
    } else {
      // 로그인 아닌 상태 처리
      loadContent("./sub/member/login.html");
    }
  });

  // 로그아웃 버튼 클릭 시 localStorage에서 토큰 삭제
  $("#loginYn").click(function () {
    if ($("#loginYn").text() == "로그아웃") {
      localStorage.removeItem("token");
      alert("로그아웃 되었습니다.");
      $("#loginYn").text("로그인");
      $("#join").css("display","block");
      $(".head-login").css("display","none");
    } else {
      loadContent("./sub/member/login.html");
    }
  });
});

function loadContent(page) {
  const content = $("#cont");
  fetch(page)
    .then((response) => response.text())
    .then((html) => {
      content.html(html);
    })
    .catch((err) => {
      content.innerHTML = "<p>Error loading content.</p><br/>" + err;
    });

    /////////서브 구분 : wsj
    $(this).click(function(){
      $('#cont').css('display','block')
      $('#main').css('display','none')
      $('body').addClass('sub')
      $('body').removeClass('main')

    })
}
    /////////메인 구분 : wsj
  $(this).click(function(){
    if ($(this).href === './index.html') {
      $('#cont').css('display','none')
      $('#main').css('display','block')
      $('body').addClass('main')
      $('body').removeClass('sub')
    }
  })

function getToken() {
  // localStorage에서 토큰 가져오기
  var token = localStorage.getItem("token");

  if (token) {
    // 토큰을 base64 디코딩하여 아이디와 비밀번호 복원
    var decodedToken = atob(token);
    var credentials = decodedToken.split(":"); // 아이디와 비밀번호 분리
    var pid = credentials[0];
    var password = credentials[1];

    $("#loginYn").text("로그아웃");
    $("#join").css("display","none");
    $(".head-login").css("display","block");
  } else {
    $("#loginYn").text("로그인");
    $("#join").css("display","block");
    $(".head-login").css("display","none");
  }
}
