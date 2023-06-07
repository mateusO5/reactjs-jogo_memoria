import * as C from './App.styles'; 
import logoImage from './assets/devmemory_logo.png';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/InfoItem/Button';
import Restart from './svgs/restart.svg';
import { useEffect, useState }  from 'react';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridITem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';



function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0); 
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => {
    resetAndCreatGrid();
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) setTimeElapsed(timeElapsed +1);
    }, 1000)
      return() => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() =>{
    if(shownCount === 2) {
      let opened = gridItems.filter(item=> item.shown===true);
      if(opened.length === 2) {
        
        if(opened[0].item === opened[1].item) {
          let tempGrid = [...gridItems];
          for( let i in tempGrid) {
            if(tempGrid[i].shown) {
              tempGrid[i].permanentShown = true;
              tempGrid[i].shown = false;
              
            }
          }
          setGridItems(tempGrid); 
          setShownCount(0);
        } else {
          setTimeout(() => {
            let tempGrid = [...gridItems];
            for(let i in tempGrid) {
             tempGrid[i].shown = false;
            }
            setGridItems(tempGrid); 
            setShownCount(0);
          }, 1000);
        }

        setMoveCount(moveCount => moveCount +1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect (()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }


  }, [moveCount, gridItems]);


  const resetAndCreatGrid = () => {
    //passo 1 - Resetar o jogo:
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    // 2.1 criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    //2.2 - preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    //2.3 - jogar no state
    setGridItems(tmpGrid);

    //passo 3 - criar o grid e começar o jogo:
    setPlaying(true);




  };


  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2 ) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount +1);

      }

      setGridItems(tmpGrid);
    }

  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="#">
          <img src={logoImage} width="200" alt='' />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimento' value={moveCount.toString()} />


        </C.InfoArea>

        <Button label='Reiniciar' icon={Restart} onClick={resetAndCreatGrid} />

      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) =>(
            <GridItem 
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))} 
        </C.Grid>

      </C.GridArea>

    </C.Container>

  );
}

export default App;