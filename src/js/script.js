$( document ).ready( function() {

  console.clear();

  //--- Some foo global data aka story ---//
  var story = [
    {"ident":"0","year":"1","story":"Walter Benjamin wurde als Sohn des Antiquitäten- und Kunsthändlers Emil Benjamin (1856–1926) und dessen Frau Pauline (1869–1930) (geb. Schoenflies) in Berlin-Charlottenburg geboren. Seine Familie gehörte dem assimilierten Judentum an. Walter Benjamin war der Älteste von drei Geschwistern, Dora (1901–1946) und Georg Benjamin und damit Schwager von Hilde Benjamin, zudem Cousin von Gertrud Kolmar und Günther Anders (→ Familien Schoenflies und Hirschfeld). Benjamins Onkel William Stern war ein bekannter deutscher Kinderpsychologe, der das Konzept des Intelligenzquotienten (IQ) entwickelte",'lat':'52.5044579','lon':'13.3033738'},
    {"ident":"1","year":"2","story":"Seine Kindheit, deren Erinnerungen in der Berliner Kindheit um neunzehnhundert festgehalten sind, verbrachte Benjamin überwiegend in Berlin. Das Wohnhaus der Familie, Delbrückstraße 23 in Berlin-Grunewald, ist heute nicht mehr erhalten.",'lat':'52.488323','lon':'13.2610909'},
    {"ident":"2","year":"3","story":"In den Jahren 1905 bis 1907 besuchte er indes die Hermann-Lietz-Schule Haubinda, eine Reformschule in Thüringen. Dort lernte er den Lehrer Gustav Wyneken kennen, der ihn tief beeindruckte und zu einem Engagement in der Jugendbewegung veranlasste.",'lat':'50.3376','lon':'10.6449'},
    {"ident":"3","year":"4","story":"Nach dem Abitur 1912 am Kaiser-Friedrich-Gymnasium in Charlottenburg",'lat':'52.5044579','lon':'13.3033738'},
    {"ident":"4","year":"5","story":"begann Benjamin sein Studium der Philosophie, Germanistik und Kunstgeschichte an der Albert-Ludwigs-Universität in Freiburg im Breisgau und schloss dort Freundschaft mit dem Dichter Christoph Friedrich Heinle",'lat':'47.9874','lon':'7.7963'},
    {"ident":"5","year":"6","story":"Im Wintersemester 1912/13 setzte er sein Studium in Berlin fort.",'lat':'52.5170365','lon':'13.3888599'},
    {"ident":"6","year":"7","story":"Der Suizid Heinles am 8. August 1914 war ein tiefer Schock für Benjamin. Er widmete dem verstorbenen Freund Sonette und bemühte sich vergeblich, für dessen hinterlassenes Werk einen Verleger zu finden. Die zunehmende Kriegsbegeisterung Wynekens führte 1915 zum Bruch mit seinem Lehrer"},
    {"ident":"7","year":"8","story":"Im selben Jahr lernte Benjamin den fünf Jahre jüngeren Mathematikstudenten Gershom Scholem kennen, mit dem er sich befreundete. 1917 heiratete Benjamin Dora (Sophie) Kellner (1890–1964), Tochter von Leon Kellner (1859–1928) und dessen Ehefrau, der Schriftstellerin und Übersetzerin Anna Kellner geb. Weiß (1862–1941).[4] Die Ehe hielt 13 Jahre und brachte den gemeinsamen Sohn Stefan Rafael (11. April 1918 bis 6. Februar 1972) hervor."},
    {"ident":"8","year":"9","story":"Noch im Jahr der Eheschließung (auch, um einer drohenden Einberufung zum Militär zu entgehen) wechselte Benjamin nach Bern, wo er in den nächsten zwei Jahren seine Dissertation mit dem Titel Der Begriff der Kunstkritik in der deutschen Romantik bei Richard Herbertz schrieb. Am 27. Juni 1919 verteidigte er seine Doktorthese und bestand mit der Bestnote summa cum laude.",'lat':'46.94809','lon':'7.44744'},
    {"ident":"9","year":"10","story":"Wieder zurück in Berlin, machte Benjamin sich als freier Schriftsteller und Publizist selbstständig. 1923 erschien seine Übersetzung von Baudelaire-Gedichten, der er seinen selbstbewussten Aufsatz Die Aufgabe des Übersetzers voranstellte. Seine 1921 erschienene philosophische Schrift Zur Kritik der Gewalt erregte Aufmerksamkeit. Im selben Jahr erwarb er ein Bild von Paul Klee mit dem Titel Angelus Novus",'lat':'52.5170365','lon':'13.3888599'},
    {"ident":"10","year":"11","story":"nachdem sein Versuch, eine Zeitschrift gleichen Namens herauszugeben, gescheitert war, ging Benjamin 1923/24 nach Frankfurt am Main, um sich dort zu habilitieren. Hier lernte er Theodor W. Adorno und Siegfried Kracauer kennen,",'lat':'50.1106529','lon':'8.6820934'},
    {"ident":"11","year":"12","story":"mit denen er und Alfred Sohn-Rethel im September 1925 einen mehrwöchigen Urlaubsaufenthalt am Golf von Neapel verbrachten",'lat':'40.8537','lon':'14.2429'}
  ];

  //--- leaflet.js ---//
  var storyMap = L.map('map-container').setView([51.505, -0.09], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(storyMap);

  //--- storyControl Modul ----//
  var storyControl = ( function (){

    var
    storageStory = '', //stor all story data ( ? necessary ? )
    selectCounter = 0,
    storyLength = 0, //in modul: stor story length gobally, we need it
    initTime = 3000, //This is the initial Timeout in millis
    stepTimeout = 3000, //This is the Timeout between the steps
    initDown = '', //storage for initial countdown
    storyNow = 0,  //storage for story countdown
    storyN = 0,
    storyStep = 0,
    storyPause = 0,
    storyPosition = ''; //helper for current position in story-array

    //We use this to initially start a timeout on storyCountDown(); function
    function storyStart(){
      console.log( '++in++ storyStart();' )
      if( initDown ){
        clearTimeout( initDown ); //Clear the initial timeout if exists already
      }
      if( storyN == 0 ){
        storyN = storyLength;

      }
      initDown = setTimeout( storyCountDown, initTime ); //set timeout
    }

    //We use this to stop the story for once
    function storyStop(){
      console.log( '++in++ storyStop();' )
      if( storyPause == 0 ){
        if( storyNow ){
          clearTimeout( storyNow ); //Clear the story timeout if exists
        }
        console.log( 'Pause should be zero: ' + storyPause );
        storyPause = 1;
      } else if( storyPause == 1 ){
        console.log( 'Pause should be one: ' + storyPause );
        storyPause = 0;
        storyResume();
      }
    }

    //We use this to resume the story
    function storyResume(){
      console.log( '++in++ storyResume();' )
      if( storyNow ){
        clearTimeout( storyNow ); //Clear the story timeout if exists
      }
      storyCountDown();
    }

    //This is the main countdown
    function storyCountDown(){
      console.log( '++in++ storyCountDown();' )
      if( storyStep >= storyLength ){
        storyStep = 0;
        console.log( '++in++ storyCountDown(); ' + storyStep );
      }
      if( initDown ){
        clearTimeout( initDown ); //Clear the initial timeout if exists already
        console.log( '++in++ storyCountDown(); -> Clearing initDown')
      }
      if( storyNow ){
        clearTimeout( storyNow ); //Clear the story timeout if exists
        console.log( '++in++ storyCountDown(); -> Clearing storyNow')
      }
      if ( storyN > 0 ) {
        storyNow = setTimeout( storyCountDown, stepTimeout ); //set timeout on yourself
        console.log( '++in++ storyCountDown(); -> settingTimeout')
      }
      if( storyN == 0 ){  //start all over again automatically
        console.log( '++in++ storyCountDown(); -> starting story again')
        storyStart();
      }
      storyPosition = storyStep;
      console.log( '++in++ storyCountDown(); -> ' + storyStep )
      storyUpdate( storyStep );
      storyN--;
      storyStep++;
      console.log( '++in++ storyCountDown(); -> done! -> ' + storyN +' '+ storyStep)
    }

    //Update the story-presentation an map according to step
    function storyUpdate( step ){
      console.log( '++in++ storyUpdate();' )
      $( '#storypoints' ).children( '.storypoint' ).each(function () {
        if( step-1 == $( this ).data( 'ident' ) ){
          $( this ).toggleClass( 'active' );
        }
        if( step == $( this ).data( 'ident' ) ){
          $( this ).toggleClass( 'active' );
        }
      });
      if( storageStory[ step ].lat && storageStory[ step ].lon ){ //We have geodata in storypoint so move the map
        storyMap.setView( new L.LatLng( storageStory[ step ].lat, storageStory[ step ].lon , {animation: true}) );
        $( '.story-output' ).html( storageStory[ step ].story );
        storyDebug( step , 1 )
      } else {
        if( storageStory[ step ].story ){ //We have no geodata in storypoint, only update text
          $( '.story-output' ).html( storageStory[ step ].story );
          storyDebug( step , 0 )
        }
      }
    }

    //Update the interface for the story
    function storyInterface( data ){
      console.log( '++in++ storyInterface();' )
      for(var i=0; i < storyLength; i++){
        storyMap.setView( new L.LatLng( storageStory[0].lat, storageStory[0].lon ,{animation: true}), 12);
        $( '#storypoints' ).append('<a class="storypoint btn btn-sm btn-default btn-primary" href="#" data-ident="'+data[i].ident+'">'+data[i].year+'</a>');
        $( '.story-output' ).html( data[ selectCounter ].story );
      }
      $( '.control-play' ).html( 'pause' );
      $( '.control-play' ).toggleClass( 'activ' );
    }

    //Get interface-comand and update story accordingly
    function storyInteract( comand , ident){
      console.log( 'in storyInteract();' )
      console.log( 'in private selectPoint: '+ ident );
      if( comand == 'bck' ){
        storyStep--;
        console.log( 'STEP: ' + storyStep );
      }
      if( comand == 'fwd' ){
        storyStep++;
        console.log( 'STEP: ' + storyStep );
      }
      if( comand == 'play' ){
        console.log( 'STEP: ' + storyStep );
        storyStop();
      }
    }


    //Debug in UI
    function storyDebug( data, geo ){
      if( geo == 1 ){
        $( '#debug-num' ).html( data + ' geo');
      } else {
        $( '#debug-num' ).html( data + ' no geo');
      }
    }

    return {
      //public function to map the data and start the story
      generateList: function( storyData ){
        storageStory = storyData;
        storyLength = story.length;
        storyInterface( storageStory );  //generate interface according to story
        storyStart(); //start story
      },
      //public function to control the story via interface
      controlStory: function( comand, ident ){
        console.log( '++++ in public function controlStory: ' + comand +' '+ ident);
        storyInteract( comand , ident );
      }
    }
  })();

  //---Generate the Story---//
  storyControl.generateList( story );

  //---UI-Interaction---//
  $( '.storypoint' ).click(function(){
    storyControl.controlStory( 'step' , $(this).data('ident') );
  });

  $( '.control-backward' ).click(function(){
    storyControl.controlStory( 'bck' , '' );
  });

  $( '.control-forward' ).click(function(){
    storyControl.controlStory( 'fwd' , '' );
  });

  $( '.control-play' ).click(function(){
    storyControl.controlStory( 'play' , '' );
  });

  $( '.control-reset' ).click(function(){
    storyControl.controlStory( 'rst' , '' );
  });

}); //jquery end
