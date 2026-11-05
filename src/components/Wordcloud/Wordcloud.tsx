import React from "react";
import wordcloud from "wordcloud";

const stopWords = new Set(
  (
    "a,am,an,and,are,as,at,be,by,for,from,how,i,im,in,is,it,not,of,on,or,that,the,this,to,was,what,when,where,who,will,with," +
    "и,в,во,не,на,я,а,что,ты,это,да,нет,ну,с,по,за,к,у,же,то,так,вы,он,она,мы,они,мне,тебе,там,тут,как,все,всё,бы,ли"
  ).split(","),
);

// Сколько слов рисуем: если брать все, сотни мелких слов сбиваются в кучку в центре
const MAX_WORDS = 150;

function updateWordCloud(
  wordCounts: Record<string, number>,
  canvas: HTMLCanvasElement | null,
) {
  if (!canvas) return;

  const top = Object.entries(wordCounts)
    .filter(([word]) => !stopWords.has(word.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_WORDS);
  if (!top.length) return;

  const max = top[0][1];
  const min = top[top.length - 1][1];
  const maxSize = Math.min(110, canvas.width / 8);
  const minSize = 12;

  // Логарифм, чтобы «gg» не задавил всё остальное; растягиваем на весь диапазон размеров
  const span = Math.log(max) - Math.log(min) || 1;
  const wordList = top.map(([word, count]) => [
    word,
    minSize + ((Math.log(count) - Math.log(min)) / span) * (maxSize - minSize),
  ]);
  wordcloud(canvas, {
    list: wordList as [string, number][],
    backgroundColor: "transparent",
    color: "random-light",
    fontFamily: "Inter, Roboto, sans-serif",
    gridSize: 6,
    rotateRatio: 0.2,
    shrinkToFit: true,
    wait: 1,
  });
}

type WordcloudProps = { counts: Record<string, number> };

class Wordcloud extends React.Component<WordcloudProps> {
  canvas = React.createRef<HTMLCanvasElement>();
  componentDidMount() {
    updateWordCloud(this.props.counts, this.canvas.current);
  }
  componentDidUpdate() {
    updateWordCloud(this.props.counts, this.canvas.current);
  }

  render() {
    const width = Math.min(1080, window.innerWidth * 0.75);
    const height = Math.round(width * 0.5);
    return (
      <canvas
        ref={this.canvas}
        width={width}
        height={height}
        style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
      />
    );
  }
}

export default Wordcloud;
