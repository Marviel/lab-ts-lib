/**
 * Trims the whitespace from the start and end of each line.
 *
 * Also optionally trims the leading and trailing line blocks.
 *
 * @param str The string to trim.
 * @param config { trimLeftToLeastIndent: boolean, trimVerticalStart: boolean, trimVerticalEnd: boolean } Optional config object. Defaults to { trimVerticalStart: true, trimVerticalEnd: true } if not provided.
 *         trimLeftToLeastIndent: If true, trims the whitespace from the start of each line to the least indent.
 *         trimVerticalStart: If true, removes the leading line blocks.
 *         trimVerticalEnd: If true, removes the trailing line blocks.
 * @returns The trimmed string.
 */
export function trimLines(
  str: string,
  config?: {
    trimLeftToLeastIndent?: boolean;
    trimVerticalStart?: boolean; 
    trimVerticalEnd?: boolean 
  }
): string {
  const { trimLeftToLeastIndent, trimVerticalStart, trimVerticalEnd } = {
    trimLeftToLeastIndent: config?.trimLeftToLeastIndent ?? true,
    trimVerticalStart: config?.trimVerticalStart ?? true,
    trimVerticalEnd: config?.trimVerticalEnd ?? true,
  };

  const splitLines = str.split('\n');

  function getStringLeftIndentLength(str: string): number {
    return str.length - str.trimLeft().length;
  }

  let firstOccupiedLineIdx: number | undefined = undefined;
  let lastOccupiedLineIdx: number | undefined = undefined;

  // If trimLeftToLeastIndent is true, we need to get the length of the least indent.
  let leastIndent: null | number = null;
  if (trimLeftToLeastIndent) {
    // Get the least indent.
    for (const l of splitLines) {
      // Ignore empty lines.
      if (l.trim().length === 0) {
        continue;
      }

      // Get the indent for this line.
      const indent = getStringLeftIndentLength(l)

      // Update leastIndent if needed.
      if (leastIndent === null || indent < leastIndent) {
        leastIndent = indent;
      }
    }
  }

  // Trim the whitespace for each line.
  const resultArrPreLeadTrail = splitLines.map((l, idx) => {
    // Trim the whitespace for this line.
    let newVal = l.trim();

    // If trimLeftToLeastIndent is true, trim the whitespace from the start of each line to the least indent.
    if (newVal.length > 1 && trimLeftToLeastIndent && leastIndent !== null) {
        // Calculate the correct amount of left indent for this line.
        const indentOfThisItem = getStringLeftIndentLength(l);
        const totalIndent = indentOfThisItem - leastIndent;
        // Re-add the correct amount of whitespace to the start of this line.
        newVal = `${' '.repeat(totalIndent)}${newVal}`;
    }

    // Bookkeeping
    if (newVal.length > 0) {
      if (firstOccupiedLineIdx === undefined) {
        firstOccupiedLineIdx = idx;
      }
      lastOccupiedLineIdx = idx;
    }

    return newVal;
  });

  // If this string is all whitespace, return an empty string.
  if (firstOccupiedLineIdx === undefined || lastOccupiedLineIdx === undefined) {
    return '';
  }

  let resultArr = resultArrPreLeadTrail;

  // Remove leading & trailing line blocks
  if (trimVerticalStart && trimVerticalEnd) {
    resultArr = resultArrPreLeadTrail.slice(
            firstOccupiedLineIdx as number,
            // @ts-ignore
            (lastOccupiedLineIdx as number) + 1
          );
  }
  // Just remove leading
  else if (trimVerticalStart) {
    resultArr = resultArrPreLeadTrail.slice(firstOccupiedLineIdx as number)
  }
  // Just remove trailing
  else if (trimVerticalEnd) {
    resultArr = resultArrPreLeadTrail.slice(0, (lastOccupiedLineIdx as number) + 1)
  }

  // Join lines together and done.
  return resultArr.join('\n');
}
