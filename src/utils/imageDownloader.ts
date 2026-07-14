import { GridDownloadOptions } from '../types/downloadTypes';
import { MappedPixel, PaletteColor } from './pixelation';
import { getDisplayColorKey, getColorKeyByHex, ColorSystem } from './colorSystemUtils';

// 闁活潿鍔嬬花顒勬嚔瀹勬澘绲块悗浣冾潐閻︻噣鎳濋懠顒佺暠鐎规悶鍎遍崣鍧楀礄閼恒儲娈?- 濞寸姴绐媋ge.tsx濠㈣泛绉撮崺?function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000'; // Default to black
  // Simple brightness check (Luma formula Y = 0.2126 R + 0.7152 G + 0.0722 B)
  const luma = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luma > 0.5 ? '#000000' : '#FFFFFF'; // Dark background -> white text, Light background -> black text
}

// 閺夊牆鎳庢慨顏堝礄閼恒儲娈堕柨娑欒壘閻ㄣ垽宕℃担绋垮綃閺夆晜绋戦崺妤侊紣濠婂棗顥忛弶鐑嗗墯瀹曞弶绋夌弧鐑
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// 闁活潿鍔嬬花顒勫箳閹烘垹纰嶅Λ鐗堢矎婢瑰﹪鏌ㄩ鐐暠闁告垼濮ら弳?- 濞寸姴绐媋ge.tsx濠㈣泛绉撮崺?function sortColorKeys(a: string, b: string): number {
  const regex = /^([A-Z]+)(\d+)$/;
  const matchA = a.match(regex);
  const matchB = b.match(regex);

  if (matchA && matchB) {
    const prefixA = matchA[1];
    const numA = parseInt(matchA[2], 10);
    const prefixB = matchB[1];
    const numB = parseInt(matchB[2], 10);

    if (prefixA !== prefixB) {
      return prefixA.localeCompare(prefixB); // Sort by prefix first (A, B, C...)
    }
    return numA - numB; // Then sort by number (1, 2, 10...)
  }
  // Fallback for keys that don't match the standard pattern (e.g., T1, ZG1)
  return a.localeCompare(b);
}

// 瀵煎嚭CSV hex鏁版嵁鐨勫嚱鏁?
export function exportCsvData({
  mappedPixelData,
  gridDimensions,
  selectedColorSystem
}: {
  mappedPixelData: MappedPixel[][] | null;
  gridDimensions: { N: number; M: number } | null;
  selectedColorSystem: ColorSystem;
}): void {
  if (!mappedPixelData || !gridDimensions) {
    console.error("閻庣數鍘ч崵顓熷緞鏉堫偉袝: 闁哄嫮濮撮惃鐘诲极閻楀牆绁﹂柟瀛樼墪閺勫倻鈧潧鎲″Λ銈夊极閸稈鍋?);
    alert("闁哄啰濮电涵鍓佲偓鐢靛帶閸ょ懣SV闁挎稑鏈弳鐔煎箲椤旇姤寮撻柣銏㈠枑閸ㄦ岸骞嬮弽銊︼骏闁轰礁鐗勯埀?);
    return;
  }

  const { N, M } = gridDimensions;

  // 闁汇垻鍠愰崹娆砈V闁告劕鎳庨鎰版晬鐏炲墽妲ㄩ悶娑樺閸烆剛鎮伴妸銉︾缂佹儳鎽滃▓鎴炵▔閳ь剛鎮?  const csvLines: string[] = [];

  for (let row = 0; row < M; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < N; col++) {
      const cellData = mappedPixelData[row][col];
      if (cellData && !cellData.isExternal) {
        // 闁告劕鎳橀崕鎾础閺囩偛甯楅柡宥囥€嬬槐婵堟媼閺夎法绉縣ex濡増绮忔竟濠囧磹?        rowData.push(cellData.color);
      } else {
        // 濠㈣埖鐗犻崕鎾础閺囩偛甯楅柡宥呭悑閸ㄣ劎绮氶搹瑙勵仱闁挎稑濂旀繛鍥偨閵娧冾棗婵炲牆锕ラ悥锝囨媼?        rowData.push('TRANSPARENT');
      }
    }
    csvLines.push(rowData.join(','));
  }

  // 闁告帗绋戠紓鎻匰V闁告劕鎳庨?  const csvContent = csvLines.join('\n');

  // 闁告帗绋戠紓鎾荤嵁閺堢數鐟撻弶鐐垫槬SV闁哄倸娲ｅ▎?  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `bead-pattern-${N}x${M}-${selectedColorSystem}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 闂佹彃锕ラ弬涔丷L閻庣數顢婇挅?  URL.revokeObjectURL(url);

  console.log("CSV闁轰胶澧楀畵浣衡偓鐢靛帶閸ゎ厾鈧懓鏈崹?);
}

// 閻庣數鍘ч崣鍜癝V hex闁轰胶澧楀畵渚€鎯冮崟顐㈡瘣闁?export function importCsvData(file: File): Promise<{
  mappedPixelData: MappedPixel[][];
  gridDimensions: { N: number; M: number };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('闁哄啰濮电涵鍓佹嫚鐠囨彃绲块柡鍌氭矗濞嗐垽宕橀崨顓у晣'));
          return;
        }

        // 閻熸瑱绲鹃悗绱篠V闁告劕鎳庨?        const lines = text.trim().split('\n');
        const M = lines.length; // 閻炴稑鏈弳?
        if (M === 0) {
          reject(new Error('CSV闁哄倸娲ｅ▎銏＄▔閾忓厜鏁?));
          return;
        }

        // 閻熸瑱绲鹃悗鐣岀箔椤戣法顏遍悶娑樼焷楠炲繘宕ｉ弽褍鐏欓柡?        const firstRowData = lines[0].split(',');
        const N = firstRowData.length; // 闁告帗顨嗛弳?
        if (N === 0) {
          reject(new Error('CSV闁哄倸娲ｅ▎銏ゅ冀閻撳海纭€闁哄啰濮甸弲?));
          return;
        }

        // 闁告帗绋戠紓鎾诲及閻樿尙娈搁柡浣哄瀹?        const mappedPixelData: MappedPixel[][] = [];

        for (let row = 0; row < M; row++) {
          const rowData = lines[row].split(',');
          const mappedRow: MappedPixel[] = [];

          // 缁绢収鍠曠换姘掕箛姘兼斀闂侇喛濮ゅ﹢浣割潰閿濆洠鈧﹢鎯冮崟顐㈢仚闁?          if (rowData.length !== N) {
            reject(new Error(`缂?{row + 1}閻炴稑鐬煎▓鎴﹀礆濡や焦娈跺☉鎾崇Т鐏忣噣鏌婂蹇曠闁哄牏鍠愬﹢?{N}闁告帗顨愮槐婵堚偓鍦仱濡?{rowData.length}闁告帗顣?);
            return;
          }

          for (let col = 0; col < N; col++) {
            const cellValue = rowData[col].trim();

            if (cellValue === 'TRANSPARENT' || cellValue === '') {
              // 濠㈣埖鐗犻崕?闂侇偄绻戝Σ鎴﹀础閺囩偛甯楅柡?              mappedRow.push({
                key: 'TRANSPARENT',
                color: '#FFFFFF',
                isExternal: true
              });
            } else {
              // 濡ょ姴鐭侀惁濉癳x濡増绮忔竟濠囧冀閻撳海纭€
              const hexPattern = /^#[0-9A-Fa-f]{6}$/;
              if (!hexPattern.test(cellValue)) {
                reject(new Error(`缂?{row + 1}閻炴稑鐬奸?{col + 1}闁告帗顨堝▓鎴烇紣濠婂棗顥忛柛濠傚悑濡倝寮崼顒傜獥${cellValue}`));
                return;
              }

              // 闁告劕鎳橀崕鎾础閺囩偛甯楅柡?              mappedRow.push({
                key: cellValue.toUpperCase(),
                color: cellValue.toUpperCase(),
                isExternal: false
              });
            }
          }

          mappedPixelData.push(mappedRow);
        }

        // 閺夆晜鏌ㄥú鏍喆閿濆棛鈧晫绱掗幘瀵镐函
        resolve({
          mappedPixelData,
          gridDimensions: { N, M }
        });

      } catch (error) {
        reject(new Error(`閻熸瑱绲鹃悗绱篠V闁哄倸娲ｅ▎銏″緞鏉堫偉袝闁?{error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('閻犲洩顕цぐ鍥棘閸ワ附顐藉鎯扮簿鐟?));
    };

    reader.readAsText(file, 'utf-8');
  });
}

// 濞戞挸顑堝ù鍥炊閸撗冾暬闁汇劌瀚€靛矂宕欓懞銉︽
export async function downloadImage({
  mappedPixelData,
  gridDimensions,
  colorCounts,
  totalBeadCount,
  options,
  activeBeadPalette,
  selectedColorSystem
}: {
  mappedPixelData: MappedPixel[][] | null;
  gridDimensions: { N: number; M: number } | null;
  colorCounts: { [key: string]: { count: number; color: string } } | null;
  totalBeadCount: number;
  options: GridDownloadOptions;
  activeBeadPalette: PaletteColor[];
  selectedColorSystem: ColorSystem;
}): Promise<void> {
  if (!mappedPixelData || !gridDimensions || gridDimensions.N === 0 || gridDimensions.M === 0 || activeBeadPalette.length === 0) {
    console.error("濞戞挸顑堝ù鍥ㄥ緞鏉堫偉袝: 闁哄嫮濮撮惃鐘诲极閻楀牆绁﹂柟瀛樼墪閺勫倻鈧潧鎲″Λ銈夊极閸稈鍋?);
    alert("闁哄啰濮电涵鑸电▔鐎ｎ厽绁伴柛銉ュ⒔閻掑﹪鏁嶇仦鐐闁硅鍠楀﹢顓㈡偨閻旂鐏囬柟瀛樼墬濡倝寮崼娑掑亾?);
    return;
  }
  if (!colorCounts) {
    console.error("濞戞挸顑堝ù鍥ㄥ緞鏉堫偉袝: 闁艰褰冭ぐ璺ㄧ磼閻旀椿鍚€闁轰胶澧楀畵渚€寮悩铏珡闁?);
    alert("闁哄啰濮电涵鑸电▔鐎ｎ厽绁伴柛銉ュ⒔閻掑﹪鏁嶅畝鍐棌闁告瑩顥撶划铏规媼閳╁啯娈堕柟璇″枟濠€顓㈡偨閻旂鐏囬柟瀛樼墬濡倝寮崼娑掑亾?);
    return;
  }

  // 濞戞挻妲掗々锔界▔鐎ｎ厽绁板璺哄閹﹪宕欓懞銉︽
  const processDownload = () => {
    const { N, M } = gridDimensions; // 婵縿鍊栧鍌氼啅閼碱兘鈧ɑ绌卞顡竔dDimensions濞戞挸绉崇拹鐒爑ll
    const downloadCellSize = 30;

    // 濞寸姴绨肩粭鍛姜娴犲鍋撴径鎰┾偓宥嗙▔椤撯€崇闁告瑦鐗為鏇犵磾?    const { showGrid, gridInterval, showCoordinates, gridLineColor, includeStats, showCellNumbers = true } = options;

    // 閻犱礁澧介悿鍡樻綇绾懐鐛╃紒灞炬そ濡潡鎮介妸銈囪壘闁秆勫姈閻栵絾娼€涙鍨兼繛澶樼厜缁辨瑦淇婇崒娑氫函闂傚洠鍋撻悷鏇氱筏缁?    const axisLabelSize = showCoordinates ? Math.max(30, Math.floor(downloadCellSize)) : 0;

    // 閻庤鐭粻鐔虹磼閻旀椿鍚€闁告牕鎼悡娆撴儍閸曨偆鍞ㄩ柡鍫墮瀵剟寮?    const statsPadding = 20;
    let statsHeight = 0;

    // 濡澘瀚崢娑氭媼閿涘嫮鏆柣顫妺缁剛鈧稒銇炵紞瀣緞瑜嶉惃顒勬儍閸曨偄缍侀梺?    const preCalcWidth = N * downloadCellSize + axisLabelSize;
    const preCalcAvailableWidth = preCalcWidth - (statsPadding * 2);

    // 閻犱緤绱曢悾鑽も偓娑欍仦缂嶅寰勮閻?- 濞戞挸閰ｉ·渚€鎳濋懠顒傚煚閻犱讲鈧啿闅橀柛鈺冨枍缁绘岸骞愭担椋庮伇闁?    const baseStatsFontSize = 13;
    const widthFactor = Math.max(0, preCalcAvailableWidth - 350) / 600;
    const statsFontSize = Math.floor(baseStatsFontSize + (widthFactor * 10));

    // 閻犱緤绱曢悾缁橈紣濠靛棭妯嗛弶鍫㈩攰缁愭盯鏁嶅畝鈧垾妯荤┍濠靛棙缍忛柡宥呮处閺嗙喓鈧稒顨呴悾顒勫礂閵婏附鈻旂紒鈧悮瀵哥闁搞儲绋栫粩鐔兼焾娴犲浠橀悷鏇氱筏缁?    const extraLeftMargin = showCoordinates ? Math.max(20, statsFontSize * 2) : 0; // 鐎归潻缂氶弲鑸碉紣濠靛棭妯嗛弶鍫㈩攰缁?    const extraRightMargin = showCoordinates ? Math.max(20, statsFontSize * 2) : 0; // 闁告瑥鍘栭弲鑸碉紣濠靛棭妯嗛弶鍫㈩攰缁?    const extraTopMargin = showCoordinates ? Math.max(15, statsFontSize) : 0; // 濡炪倕鐖奸崕瀛橈紣濠靛棭妯嗛弶鍫㈩攰缁?    const extraBottomMargin = showCoordinates ? Math.max(15, statsFontSize) : 0; // 閹煎瓨娲熼崕瀛橈紣濠靛棭妯嗛弶鍫㈩攰缁?
    // 閻犱緤绱曢悾鑽ょ磾閹寸偟澹愰悘蹇撴惈椤?    const gridWidth = N * downloadCellSize;
    const gridHeight = M * downloadCellSize;

    // 閻犱緤绱曢悾缁樻償閺囥垹鍔ラ柛婵呰兌婢ф繈寮介崶顏嗘闁告牕鎼悡娆撴儍閸曨垳褰幖?    const xiaohongshuAreaHeight = 35; // 濞戞挸鎼幖褔鎮х仦鍓у灱閻犲洤妫濋。鈺呮偩濞嗘垶鐣遍幖瀛樻礋閸庡绮氬ú顏咃紵

    // 閻犱緤绱曢悾濠氬冀閸ヮ剦鏆柡宥呯箻閻濐喗鎯旈敂鑲╃闁哄秷顫夊畵渚€宕堕崜褍顣诲鍫嗗啰姣堥柤濂変簻婵晝鎷崘鈺傛闁?    const baseTitleBarHeight = 80; // 濠⒀呭仜閵囧洭宕洪搹璇℃敤濡ゅ倹锚鐎?
    // 闁稿繐鐗愰鍝ョ不濡炲墽顏卞☉鎿冧簻閸ㄥ灚鎱ㄧ€ｂ晝鐟撻弶鐐舵椤旀梹鎯旈敂鑺ラ檷缁绢収鍠栭悾鍓х磽閳哄倹鏉规慨锝嗘煣缁?    const initialWidth = gridWidth + axisLabelSize + extraLeftMargin;
    // 濞达綀娉曢弫銈夊箑鐠囧樊鍟嶉幖杈剧畳閳ь剙濂旂粭澶愬及椤栨艾绀嬮柛蹇撳暞閻楀憡寰勮閻剟寮堕妷顭戝悁缂佺姵顨嗛惁顔界瑹鐎ｅ墎绀夌痪顓у枙缁绘氨鈧稒銇炵紞瀣捶閵娿儯浜ｉ悘蹇撴惈椤曨參宕堕崜褍顣诲☉鎾筹梗缁″啰鎼鹃崘宸濠?    const titleBarScale = Math.max(1.0, Math.min(2.0, initialWidth / 1000)); // 闁哄洤鐡ㄧ缓鐑樻交濞戞碍鐣辩紓鍌楁櫆閺備胶绮甸弽顐ｆ
    const titleBarHeight = Math.floor(baseTitleBarHeight * titleBarScale);

    // 閻犱緤绱曢悾濠氬冀閸ヮ剦鏆柡鍌氭搐閻⊙勫緞瑜嶉惃?- 濞戞挸瀛╅埀顒冾唺缂嶅鈧妫勭€规娊鎯勭粙鍨綘闁兼澘濂旂粭澶愬及椤栨艾绀嬮柛蹇撳暞閻楀憡寰勮閻?    const titleFontSize = Math.max(28, Math.floor(28 * titleBarScale)); // 闁哄牃鍋撻悘?8px闁挎稑鐬奸垾妯荤┍濠靛棗璁查悹鍥╃帛閳?
    // 閻犱緤绱曢悾缁樼瀹€鈧ǎ顕€鎯嶆担鎼炰海閻?    const qrSize = Math.floor(titleBarHeight * 0.85); // 濠⒀呭仜閵囧洦绂嶅畝鈧ǎ顕€鎯嶆担鍦Х濞?
    // 閻犱緤绱曢悾鑽ょ磼閻旀椿鍚€闁告牕鎼悡娆撴儍閸曨偁浜ｉ悘?    if (includeStats && colorCounts) {
      const colorKeys = Object.keys(colorCounts);

      // 缂備胶鍠曢鎼佸礌閸濆嫮鍘靛銈呯埣閸庡瓨锛愬┑鍡╂▎闂傚倻顥愮粣?      const statsTopMargin = 24; // 濞戞挸绨肩粭鍛村棘鐟欏嫯顩柡灞炬尰濡炲倹绌卞┑鍥х槷濞戞挴鍋撻柤?
      const chipHeight = Math.max(30, statsFontSize + 16);
      const chipGap = 10;
      let rowCount = 1;
      let currentRowWidth = 0;

      colorKeys.forEach((key) => {
        const label = getColorKeyByHex(key, selectedColorSystem);
        const count = colorCounts[key].count;
        const estimatedWidth = Math.max(88, (label.length + String(count).length + 4) * statsFontSize * 0.62 + 34);

        if (currentRowWidth > 0 && currentRowWidth + estimatedWidth + chipGap > preCalcAvailableWidth) {
          rowCount++;
          currentRowWidth = estimatedWidth;
        } else {
          currentRowWidth += estimatedWidth + (currentRowWidth > 0 ? chipGap : 0);
        }
      });

      const titleHeight = 28;
      const footerHeight = 28;
      statsHeight = titleHeight + (rowCount * chipHeight) + ((rowCount - 1) * chipGap) + footerHeight + (statsPadding * 2) + statsTopMargin;
    }

    // 閻犲鍟弳锝夋偨鐠囪尙顏村鍫嗗啰姣堥柨娑樿嫰鐎垫﹢宕ラ锝囧灱濡増蓱閻栴噣濡存担鍛婄稄闁哄秴娲╅柊閬嶅Υ娴ｈ櫣鍩犻悹浣测偓鍐查殬闁糕晝鍠庨幏浼村传娴ｅ搫顤傞柡宥呮穿閻︽垿宕犻崫鍕幍闁挎稑鐗嗗ú鎾存綇瑜版帒鍘撮柡鍫濐槸濞兼寮介崶椋庣
    const downloadWidth = gridWidth + (axisLabelSize * 2) + extraLeftMargin + extraRightMargin;
    let downloadHeight = titleBarHeight + gridHeight + (axisLabelSize * 2) + statsHeight + extraTopMargin + extraBottomMargin + xiaohongshuAreaHeight;

    let downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = downloadWidth;
    downloadCanvas.height = downloadHeight;
    const context = downloadCanvas.getContext('2d');
    if (!context) {
      console.error("濞戞挸顑堝ù鍥ㄥ緞鏉堫偉袝: 闁哄啰濮电涵鍫曞礆濞戞绱﹀☉鎾崇摠濡?Canvas Context闁?);
      alert("闁哄啰濮电涵鑸电▔鐎ｎ厽绁伴柛銉ュ⒔閻掑﹪濡?);
      return;
    }

    // 濞达綀娉曢弫銈夋閻愮鏁勯柣銊ュ灮ontext闁告瑦锕㈤崳?    let ctx = context;
    ctx.imageSmoothingEnabled = false;

    // 閻犱礁澧介悿鍡涙嚄鐏炵偓鐝柤?    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, downloadWidth, downloadHeight);

    // 闂佹彃绉甸弻濠勬媼閹规劦鍚€闁汇劌瀚獮鍥ㄧ閿濆洨鏆嗘繛韫劍閻栵絾锛愬Ο鑽ゅ焿
    // 1. 濞戞挻妲掗崕妤呭疾?- 缂佺虎鍨伴崳锝夋儍閸曨剛绠掗柤纭咁嚋缁辨繃绋夐幘鑼懝闁?    ctx.fillStyle = '#1F2937'; // 婵烇綀浜导鍡涙嚌鐠囇呯闁哄啨鍨哄﹢浣圭▔閹捐尙鐟归柟鎵枎瀵灚绋夊鍡楊潵濠㈡儼妗ㄧ€靛瞼鎲版担绋挎暥閻?    ctx.fillRect(0, 0, downloadWidth, titleBarHeight);

    // 2. 鐎归潻缂氶弲鍫曞传娴ｅ搫顤傞柤瑙勫絻濞?- 濞达絾绮堢拹鐑瞣go閺夌偞鍨濈紞?    const brandBlockWidth = titleBarHeight * 0.8;
    const brandGradient = ctx.createLinearGradient(0, 0, brandBlockWidth, titleBarHeight);
    brandGradient.addColorStop(0, '#6366F1'); // 闁绘粓顣﹂崬顒勬嫅濠靛﹤顥?
    brandGradient.addColorStop(1, '#8B5CF6'); // 闁绘粓顣﹂崬顒傛椤愩儱顥?

    ctx.fillStyle = brandGradient;
    ctx.fillRect(0, 0, brandBlockWidth, titleBarHeight);

    // 3. 缂備焦锚閸╂鎮虫０浣告暕Logo - 闁告垹濮崇紞宥夊炊閹嗗煂缂備礁瀚幃?    const logoSize = titleBarHeight * 0.4;
    const logoX = brandBlockWidth / 2;
    const logoY = titleBarHeight / 2;

    // Logo: 闁圭柉澹堥惇鎾儍閸曨剙鈻曢悹鐏恒們鈧啰绮?- 闁革箑妫滈～妤呭棘閻熺増鍋ラ梻鍐涧閸?    ctx.fillStyle = '#FFFFFF';
    const beadSize = logoSize / 4;
    const beadSpacing = beadSize * 1.2;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const beadX = logoX - logoSize/2 + col * beadSpacing;
        const beadY = logoY - logoSize/2 + row * beadSpacing;

        // 缂備焦锚閸╂宕烽崱姘兼健闁哄倻鎳撳锟犳晬鐏炵伕渚€骞忛悢绋款伝閻?        ctx.beginPath();
        ctx.roundRect(beadX, beadY, beadSize, beadSize, beadSize * 0.2);
        ctx.fill();

        // 婵烇綀顕ф慨鐐寸▔椤撶偟濡囬悘蹇撶箰濞撻箖鎮欓惂鍝ョ濠⒀呭仜婵偤骞忛懝鎵垢闁绘鎳撶欢?        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.beginPath();
        ctx.arc(beadX + beadSize/2, beadY + beadSize/2, beadSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
      }
    }

    // 4. 濞戞挾绮悥锝嗭紣?- 闁绘粓顣﹂崬顒傗偓娑欍仦缂嶅鏁嶇仦鍓ь伕闁哄懏婢橀惇鏉库枎?    const mainTitleFontSize = Math.max(20, Math.floor(titleFontSize * 0.8));
    const subTitleFontSize = Math.max(12, Math.floor(titleFontSize * 0.45));

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 ${mainTitleFontSize}px system-ui, -apple-system, sans-serif`; // 闁绘粓顣﹂崬顒傗偓娑欍仦缂嶅寮?    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // 濞戞挾绮悥锝嗭紣濡湱绉寸紓?    const titleStartX = brandBlockWidth + titleBarHeight * 0.3;
    const mainTitleY = titleBarHeight * 0.4;

    ctx.fillText('濠电姴顦…褔骞忛懝鎵垢', titleStartX, mainTitleY);

    // 5. 闁告搩鍨遍悥锝嗭紣?- 闁告梻鍠曢崗妯兼嫚鐎涙ɑ顫?
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `400 ${subTitleFontSize}px system-ui, -apple-system, sans-serif`;
    const subTitleY = titleBarHeight * 0.65;

    ctx.fillText('濞存粌鏈濂稿礂閸愨晛顏婚悹鐐叉濞存鐥崫銉︽櫢闁瑰瓨鍔曞▍?, titleStartX, subTitleY);



    // 7. 濞村吋锕㈠▔銈夋儍閸曨偄鐎婚柛鎾瑰皺閸?    const separatorY = titleBarHeight - 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, separatorY);
    ctx.lineTo(downloadWidth, separatorY);
    ctx.stroke();

    // 8. 闁告繀鑳舵晶婵堟喆閹烘挾鍨奸柛鏍ф惈閻?    const qrX = downloadWidth - qrSize - titleBarHeight * 0.15;
    const qrY = (titleBarHeight - qrSize) / 2;

    // 閻熸瑦甯楅悥锝夋嚄鐏炵偓鐝?- 闁革箑妫滈～妤呮晬鐏炵偓绾柣婊堫暒閸?    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, qrSize * 0.08);
    ctx.fill();

    ctx.fillStyle = '#EC4899';
    const qrPlaceholderFontSize = Math.max(10, Math.floor(13 * titleBarScale));
    ctx.font = `700 ${qrPlaceholderFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('濠电姴顦…?, qrX + qrSize / 2, qrY + qrSize * 0.42);
    ctx.font = `500 ${Math.max(8, Math.floor(10 * titleBarScale))}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#8B5CF6';
    ctx.fillText('闁圭柉澹堥惇?, qrX + qrSize / 2, qrY + qrSize * 0.64);

    console.log(`Generating download grid image: ${downloadWidth}x${downloadHeight}`);
    const fontSize = Math.max(8, Math.floor(downloadCellSize * 0.4));

    // 濠碘€冲€归悘澶愭閳ь剛鎲版笟濠勭闁稿繐鐗忕划顖炲礆鐠虹儤缍忛柡宥呮穿闁伴亶宕畝鈧紞澶愬冀閼规澘鍓归柡?    if (showCoordinates) {
      // 缂備焦锚閸╂宕搁幇顓犲灱閺夌偟顥愰崕妤呭疾?      ctx.fillStyle = '#F5F5F5'; // 婵炴潙鎳愭导鍡涙嚌閼艰泛鍓归柡?      // 婵☆垼浜ｉ柊閬嶆嚄鐏炵偓鐝?(濡炪倕鐖奸崕?
      ctx.fillRect(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin, gridWidth, axisLabelSize);
      // 婵☆垼浜ｉ柊閬嶆嚄鐏炵偓鐝?(閹煎瓨娲熼崕?
      ctx.fillRect(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin + axisLabelSize + gridHeight, gridWidth, axisLabelSize);
      // 缂佸彞绲婚柊閬嶆嚄鐏炵偓鐝?(鐎归潻缂氶弲?
      ctx.fillRect(extraLeftMargin, titleBarHeight + extraTopMargin + axisLabelSize, axisLabelSize, gridHeight);
      // 缂佸彞绲婚柊閬嶆嚄鐏炵偓鐝?(闁告瑥鍘栭弲?
      ctx.fillRect(extraLeftMargin + axisLabelSize + gridWidth, titleBarHeight + extraTopMargin + axisLabelSize, axisLabelSize, gridHeight);

      // 缂備焦锚閸╂宕搁幇顓犲灱閺夌偛鐡ㄩ弳鐔衡偓?      ctx.fillStyle = '#333333'; // 闁秆勫姈閻栵綁寮弶璺ㄦ憻濡増绮忔竟?      // 濞达綀娉曢弫銈夊炊閸濆嫮鏆伴柣銊ュ閻⊙勬媴閹剧偨浜ｉ悘蹇撻獜缁辨繃绋夊鍫㈢閻炴稑鐬肩紓澶愬绩?      const axisFontSize = 14;
      ctx.font = `${axisFontSize}px sans-serif`;

      // X閺夌偠鎻槐娆愩亜閸洖鍔ラ柨娑橆槹閺嗙喓鈧?      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < N; i++) {
        if ((i + 1) % gridInterval === 0 || i === 0 || i === N - 1) { // 闁革负鍔戝Λ鍧楁⒕閺傛妲遍柕鍡曟祰閹癸絾鎱ㄧ€ｎ亶妲遍柛婊冪灱缁劑寮堕悢濂夋П闁哄秴娲﹂弫?          // 閻忓繐妫欓弳鐔衡偓娑欘殕閺備線宕烽妸銊╁彙缂佹儳銇樼粻锝嗙▔婵犲繒绀夐柤鏉垮暢濡剧粯锛愬┑鍡╂▎閺夊牏顢婄粣?          const numX = extraLeftMargin + axisLabelSize + (i * downloadCellSize) + (downloadCellSize / 2);
          const numY = titleBarHeight + extraTopMargin + (axisLabelSize / 2);
          ctx.fillText((i + 1).toString(), numX, numY);
        }
      }

      // X閺夌偠鎻槐娆愭償閺囥垹鍔ラ柨娑橆槹閺嗙喓鈧?      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < N; i++) {
        if ((i + 1) % gridInterval === 0 || i === 0 || i === N - 1) { // 闁革负鍔戝Λ鍧楁⒕閺傛妲遍柕鍡曟祰閹癸絾鎱ㄧ€ｎ亶妲遍柛婊冪灱缁劑寮堕悢濂夋П闁哄秴娲﹂弫?          // 閻忓繐妫欓弳鐔衡偓娑欘殕閺備線宕烽妸銉т亢闂侇喓鍔忛柊杈╃棯婢跺摜鐟?
          const numX = extraLeftMargin + axisLabelSize + (i * downloadCellSize) + (downloadCellSize / 2);
          const numY = titleBarHeight + extraTopMargin + axisLabelSize + gridHeight + (axisLabelSize / 2);
          ctx.fillText((i + 1).toString(), numX, numY);
        }
      }

      // Y閺夌偠鎻槐娆忣啅閿旀寧娅犻柨娑橆槹閺嗙喓鈧?      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let j = 0; j < M; j++) {
        if ((j + 1) % gridInterval === 0 || j === 0 || j === M - 1) { // 闁革负鍔戝Λ鍧楁⒕閺傛妲遍柕鍡曟祰閹癸絾鎱ㄧ€ｎ亶妲遍柛婊冪灱缁劑寮堕悢濂夋П闁哄秴娲﹂弫?          // 閻忓繐妫欓弳鐔衡偓娑欘殕閺備線宕烽妸銊╁彙缂佹儳銇樼粻锝咁啅?          const numX = extraLeftMargin + (axisLabelSize / 2);
          const numY = titleBarHeight + extraTopMargin + axisLabelSize + (j * downloadCellSize) + (downloadCellSize / 2);
          ctx.fillText((j + 1).toString(), numX, numY);
        }
      }

      // Y閺夌偠鎻槐娆撳矗閸忓懏娅犻柨娑橆槹閺嗙喓鈧?      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let j = 0; j < M; j++) {
        if ((j + 1) % gridInterval === 0 || j === 0 || j === M - 1) { // 闁革负鍔戝Λ鍧楁⒕閺傛妲遍柕鍡曟祰閹癸絾鎱ㄧ€ｎ亶妲遍柛婊冪灱缁劑寮堕悢濂夋П闁哄秴娲﹂弫?          // 閻忓繐妫欓弳鐔衡偓娑欘殕閺備線宕烽妸銉ョ濞撴皜鍡涘彙缂佹儳銇樼粭?          const numX = extraLeftMargin + axisLabelSize + gridWidth + (axisLabelSize / 2);
          const numY = titleBarHeight + extraTopMargin + axisLabelSize + (j * downloadCellSize) + (downloadCellSize / 2);
          ctx.fillText((j + 1).toString(), numX, numY);
        }
      }

      // 缂備焦锚閸╂宕搁幇顓犲灱閺夌偟顥愮粩鐔奉浖?      ctx.strokeStyle = '#AAAAAA';
      ctx.lineWidth = 1;
      // 濡炪倕鐖奸崕鏉懳熼鍥彙閹煎瓨娲濈粩?      ctx.beginPath();
      ctx.moveTo(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin + axisLabelSize);
      ctx.lineTo(extraLeftMargin + axisLabelSize + gridWidth, titleBarHeight + extraTopMargin + axisLabelSize);
      ctx.stroke();
      // 閹煎瓨娲熼崕鏉懳熼鍥彙濡炪倖鍎肩粩?      ctx.beginPath();
      ctx.moveTo(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin + axisLabelSize + gridHeight);
      ctx.lineTo(extraLeftMargin + axisLabelSize + gridWidth, titleBarHeight + extraTopMargin + axisLabelSize + gridHeight);
      ctx.stroke();
      // 鐎归潻缂氶弲鍓佺棯娴ｅ啴鍙￠柛娆忕枃缁?      ctx.beginPath();
      ctx.moveTo(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin + axisLabelSize);
      ctx.lineTo(extraLeftMargin + axisLabelSize, titleBarHeight + extraTopMargin + axisLabelSize + gridHeight);
      ctx.stroke();
      // 闁告瑥鍘栭弲鍓佺棯娴ｅ啴鍙＄€归潻绠掔粩?      ctx.beginPath();
      ctx.moveTo(extraLeftMargin + axisLabelSize + gridWidth, titleBarHeight + extraTopMargin + axisLabelSize);
      ctx.lineTo(extraLeftMargin + axisLabelSize + gridWidth, titleBarHeight + extraTopMargin + axisLabelSize + gridHeight);
      ctx.stroke();
    }

    // 闁诡厹鍨归ˇ鍙夘渶濡鍚囬柡鍌氭处濠€鎵偓闈涚秺缂嶅牓宕仦鐣屽敤缂佹儳灏呯槐婵囩▔閸濆嫭鍊电紓渚囧幘缁垶宕氱捄杞扮驳闁告垵妫楅ˇ?    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 閻犱礁澧介悿鍡涙偨閵娿倗鑹剧紓浣姑崺妤呭础閺囩偛甯楅柡宥囧帶閸炲鈧懓婀卞▓鎴犫偓娑欍仦缂?    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 缂備焦锚閸╂骞嶉埀顒勫嫉婢跺﹤绀嬮柛蹇撳暞閻?    for (let j = 0; j < M; j++) {
      for (let i = 0; i < N; i++) {
        const cellData = mappedPixelData[j][i];
        // 閻犱緤绱曢悾鑽ょ磼濡搫鐓戝ù锝呯Ф閻ゅ棝鏁嶅畝鍐ｅ亾閸愵厽顎氬Λ鐗堢箓椤︾粯娼忕涵鍛崺闁告粌鏈悥锝嗭紣濡崵鍩夊Δ鍌浢€?        const drawX = extraLeftMargin + i * downloadCellSize + axisLabelSize;
        const drawY = titleBarHeight + extraTopMargin + j * downloadCellSize + axisLabelSize;

        // 闁哄秷顫夊畵渚€寮伴姘剨闁哄嫷鍨伴ˇ濠氭焾閵娿劌鍓归柡鍜佸灣閳ユ鈧鑹鹃敐鐐哄礂閸涙惌鏉归柤?        if (cellData && !cellData.isExternal) {
          // 闁告劕鎳橀崕鎾础閺囩偛甯楅柡宥囥€嬬槐鐗堟媴鐠恒劍鏆忛柣婵堝Т閻℃瑦锛愬鍡楊棌濠靛鍋勯崢鏍嵁閸撲胶甯涢柛鎺曞煐閺嬪啴寮?          const cellColor = cellData.color || '#FFFFFF';

          ctx.fillStyle = cellColor;
          ctx.fillRect(drawX, drawY, downloadCellSize, downloadCellSize);

          if (showCellNumbers) {
            const cellKey = getDisplayColorKey(cellData.color || '#FFFFFF', selectedColorSystem);
            ctx.fillStyle = getContrastColor(cellColor);
            ctx.fillText(cellKey, drawX + downloadCellSize / 2, drawY + downloadCellSize / 2);
          }
        } else {
          // 濠㈣埖鐗犻崕鎾嚄鐏炵偓鐝柨娑欒壘閿濈偤宕楅崨顖涱仱闁?          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(drawX, drawY, downloadCellSize, downloadCellSize);
        }

        // 缂備焦锚閸╂骞嶉埀顒勫嫉婢跺﹤绀嬮柛蹇撳暞閻楁悂鎯冮崟顔剧彾婵?        ctx.strokeStyle = '#DDDDDD'; // 婵炴潙鎳撴竟濠勭棯閹稿孩钂嬪ù锝嗙矆鐠愮喖宕洪搹璇℃敤缂傚啯鍨堕悧?        ctx.lineWidth = 0.5;
        ctx.strokeRect(drawX + 0.5, drawY + 0.5, downloadCellSize, downloadCellSize);
      }
    }

    // 濠碘€冲€归悘澶愭閳ь剛鎲版笟濠勭缂備焦锚閸╂宕氶崱娑欘吘缂傚啯鍨堕悧鍝ョ棯?    if (showGrid) {
      ctx.strokeStyle = gridLineColor; // 濞达綀娉曢弫銈夋偨閵婏箑鐓曢梺顐㈩槹鐎氥劑鎯冮崟顖ｆ澒闁?      ctx.lineWidth = 1.5;

      // 缂備焦锚閸╂宕归崒婊勭函闁告帒妫濆▓褏鐥?- 闁革负鍔屽畷鐔煎礂閸愨晝澹愬☉鏂款儔濡潡鎳撶仦鑲╃憹闁哄嫷鍨电粩鐔奉浖閸℃洜鐟?
      for (let i = gridInterval; i < N; i += gridInterval) {
        const lineX = extraLeftMargin + i * downloadCellSize + axisLabelSize;
        ctx.beginPath();
        ctx.moveTo(lineX, titleBarHeight + extraTopMargin + axisLabelSize);
        ctx.lineTo(lineX, titleBarHeight + extraTopMargin + axisLabelSize + M * downloadCellSize);
        ctx.stroke();
      }

      // 缂備焦锚閸╂顫濋弶鎴︽尙闁告帒妫濆▓褏鐥?- 闁革负鍔屽畷鐔煎礂閸愨晝澹愬☉鏂款儔濡潡鎳撶仦鑲╃憹闁哄嫷鍨电粩鐔奉浖閸℃洜鐟?
      for (let j = gridInterval; j < M; j += gridInterval) {
        const lineY = titleBarHeight + extraTopMargin + j * downloadCellSize + axisLabelSize;
        ctx.beginPath();
        ctx.moveTo(extraLeftMargin + axisLabelSize, lineY);
        ctx.lineTo(extraLeftMargin + axisLabelSize + N * downloadCellSize, lineY);
        ctx.stroke();
      }
    }

    // 缂備焦锚閸╂寮紙鐘诲殝缂傚啯鍨堕悧鎼佸礌閸濆嫮鍘甸柣銊ュ鐎靛本娼忕憴鍕垫敱
    ctx.strokeStyle = '#000000'; // 濮掓稒鍨兼竟濠冩綇鐟欏嫷鏀?
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      extraLeftMargin + axisLabelSize + 0.5,
      titleBarHeight + extraTopMargin + axisLabelSize + 0.5,
      N * downloadCellSize,
      M * downloadCellSize
    );

    // 闁告搩鍨遍幐澶愬础鐢喚绐楅柡鈧幆褎韬紓鍐╁灦閻楃顔忛敂璺ㄧ憪閻熸瑦甯槐婵堢不閳ь剙煤娴ｅ搫顣奸柡?    const secondaryWatermarkFontSize = Math.max(10, Math.floor(downloadCellSize * 0.5));
    const secondaryText = '濠电姴顦…褔骞忛懝鎵垢';

    ctx.font = `500 ${secondaryWatermarkFontSize}px system-ui, -apple-system, sans-serif`;
    const secondaryMetrics = ctx.measureText(secondaryText);
    const secondaryWidth = secondaryMetrics.width;
    const secondaryHeight = secondaryWatermarkFontSize;

    const secondaryWatermarkX = extraLeftMargin + axisLabelSize + 15;
    const secondaryWatermarkY = titleBarHeight + extraTopMargin + axisLabelSize + secondaryHeight + 15;

    // 闁告搩鍨遍幐澶愬础閹峰苯鍓归柡?    const secondaryBgPadding = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.roundRect(
      secondaryWatermarkX - secondaryBgPadding,
      secondaryWatermarkY - secondaryHeight - secondaryBgPadding,
      secondaryWidth + secondaryBgPadding * 2,
      secondaryHeight + secondaryBgPadding * 2,
      3
    );
    ctx.fill();

    // 闁告搩鍨遍幐澶愬础閻楀牊鐎悗?    ctx.fillStyle = '#6B7280'; // 濞戞搩鍘鹃悺鎴︽倶閹峰苯顥忛柨娑樿嫰閻°劑宕烽妸銈囩ɑ濞戞挸绉堕悰濠囧礂閳?    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(secondaryText, secondaryWatermarkX, secondaryWatermarkY);

    // 缂備焦锚閸╂绱掗悢娲诲悁濞ｅ洠鍓濇导?    if (includeStats && colorCounts) {
      const colorKeys = Object.keys(colorCounts).sort(sortColorKeys);

      // 濠⒀呭仜婵偞锛愬┑鍡╂▎闁汇劌瀚板Λ璺ㄦ崉濠垫挾绀夐梻鍐ㄥ级椤掓盯寮介崶顒夋毌闁哄倸娲ら悺褎绗熼棃娑樺汲闁汇垼顕х粩?      const statsTopMargin = 24; // 濠⒀呭仜婵偤姊荤壕瀣崺闁挎稑鐭傚Σ璇差潰閵忊剝鐎悗娑欍仦闂€婊堝礂閵壯勬毎閻?      const statsY = titleBarHeight + extraTopMargin + M * downloadCellSize + (axisLabelSize * 2) + statsPadding + statsTopMargin;

      // 缂備焦锚閸╂绱掗悢娲诲悁闁告牕鎼悡娆撳冀閸ヮ剦鏆?
      ctx.fillStyle = '#333333';
      ctx.font = `bold ${Math.max(16, statsFontSize)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`闁活潿鍔忔竟濠傘€掗崨顓炵 / 闁?${totalBeadCount} 濡増顣? statsPadding, statsY + 8);

      // 缂備焦锚閸╂宕氶崱娑欘吘缂?      ctx.strokeStyle = '#DDDDDD';
      ctx.beginPath();
      ctx.moveTo(statsPadding, statsY + 20);
      ctx.lineTo(downloadWidth - statsPadding, statsY + 20);
      ctx.stroke();

      const titleHeight = 34;
      const chipHeight = Math.max(32, statsFontSize + 18);
      const chipGap = 10;
      const minChipWidth = 148;
      const chipCols = Math.max(
        1,
        Math.min(
          colorKeys.length,
          Math.floor((downloadWidth - statsPadding * 2 + chipGap) / (minChipWidth + chipGap))
        )
      );
      const chipWidth = Math.floor((downloadWidth - statsPadding * 2 - chipGap * (chipCols - 1)) / chipCols);
      const rowCount = Math.max(1, Math.ceil(colorKeys.length / chipCols));
      const swatchWidth = 22;

      colorKeys.forEach((key, index) => {
        const cellData = colorCounts[key];
        const displayKey = getColorKeyByHex(key, selectedColorSystem);
        const countText = `x${cellData.count}`;
        const col = index % chipCols;
        const row = Math.floor(index / chipCols);
        const chipX = statsPadding + col * (chipWidth + chipGap);
        const chipY = statsY + titleHeight + row * (chipHeight + chipGap);

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(chipX, chipY, chipWidth, chipHeight, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = cellData.color;
        ctx.fillRect(chipX + 1, chipY + 1, swatchWidth, chipHeight - 2);

        ctx.fillStyle = '#111827';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = `700 ${statsFontSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(displayKey, chipX + 30, chipY + chipHeight / 2);

        ctx.fillStyle = '#334155';
        ctx.font = `${statsFontSize}px system-ui, -apple-system, sans-serif`;
        const countWidth = ctx.measureText(countText).width;
        ctx.fillText(countText, chipX + chipWidth - countWidth - 12, chipY + chipHeight / 2);
      });

      const totalY = statsY + titleHeight + (rowCount * chipHeight) + ((rowCount - 1) * chipGap) + 18;
      ctx.font = `500 ${Math.max(10, Math.floor(statsFontSize * 0.72))}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('婵犲顭ч幏鑹扮湸', statsPadding, totalY);

      // 閺囧瓨鏌婄紒鐔活吀閸栧搫鐓欐妯哄
      const footerHeight = 28;
      statsHeight = titleHeight + (rowCount * chipHeight) + ((rowCount - 1) * chipGap) + footerHeight + (statsPadding * 2) + statsTopMargin;
    }

    // 闂佹彃绉甸弻濠勬媼閿涘嫮鏆柣銏ｎ嚙缁旈攱顨囧Ο鍝勵唺妤犵偞鍎奸惃鐔煎极?    if (includeStats && colorCounts) {
      // 閻犲鍟弳锝夋偨鐠囪尙顏村鍫嗗啰姣堥柨娑樿嫰鐎垫﹢宕ラ銉悁缂佺姵顨呴幃妤呮儍閸曨厾鍩犻悹浣测偓鍐查殬闁糕晝鍠庨幏浼村传娴ｅ搫顤傞柡宥呮穿閻︽垿宕犻崫鍕幍
      const newDownloadHeight = titleBarHeight + extraTopMargin + M * downloadCellSize + (axisLabelSize * 2) + statsHeight + extraBottomMargin + xiaohongshuAreaHeight;

      if (downloadHeight !== newDownloadHeight) {
        // 濠碘€冲€归悘澶嬵殗濡搫顔婇柛娆惷€靛弶绂嶉崱顓犵闂傚洠鍋撻悷鏇氱閸ㄥ崬顕欓悜妯荤厐闁汇劌瀚弫鍓ф暜閸愩劏瀚欏璺虹Т閸╂銇愰幘鍐差枀闁告劕鎳庨?        const newCanvas = document.createElement('canvas');
        newCanvas.width = downloadWidth;
        newCanvas.height = newDownloadHeight;
        const newContext = newCanvas.getContext('2d');

        if (newContext) {
          // 濠㈣泛绉撮崺妤呭储閻旂儤鏆伴悽顖氬暙閸炲鈧?          newContext.drawImage(downloadCanvas, 0, 0);

          // 闁哄洤鐡ㄩ弻濠囨偨鐠囪尙顏撮柛婊冨缁楀倹绋夌€ｎ偅鐎€殿喗娲滈弫?          downloadCanvas = newCanvas;
          ctx = newContext;
          ctx.imageSmoothingEnabled = false;

          // 闁哄洤鐡ㄩ弻濠冾殗濡搫顔?
          downloadHeight = newDownloadHeight;
        }
      }
    }

    try {
      const dataURL = downloadCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = showCellNumbers
        ? `bead-grid-${N}x${M}-keys-palette_${selectedColorSystem}.png`
        : `bead-grid-${N}x${M}-pixel-palette_${selectedColorSystem}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Grid image download initiated.");

      // 濠碘€冲€归悘澶愬触椤栨粍鏆忓ù婊冩尩SV閻庣數鍘ч崵顓㈡晬鐏炶姤鍊遍柡鍐硾椤曢亶宕欑弧濂闁哄倸娲ｅ▎?      if (options.exportCsv) {
        exportCsvData({
          mappedPixelData,
          gridDimensions,
          selectedColorSystem
        });
      }
    } catch (e) {
      console.error("濞戞挸顑堝ù鍥炊閸撗呭墾濠㈡儼绮剧憴?", e);
      alert("闁哄啰濮电涵鍫曟偨閻旂鐏囬柛銉ュ⒔閻掑﹥绋夌€ｎ厽绁伴梺鍓у亾鐢挳濡?);
    }
  };
  processDownload();
}
