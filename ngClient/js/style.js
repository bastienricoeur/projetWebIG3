var afficher=false;
function moveMenu(){


  if(afficher==false)
  {
    ouvrirMenu();
    afficher=true;

  }
  else
  {
    fermerMenu();
    afficher=false;
  }
}

function ouvrirMenu()
{
  $('#sideBar').css('left','0px');
  $('#menuButton').addClass('is-active');
}

function fermerMenu()
{
  $('#sideBar').css('left','-300px');
  $('#menuButton').removeClass('is-active');

}
