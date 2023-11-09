export default function parseTime(string: string): number {
    const time = string.match(/([0-9]+(\.\d+)?[dDhHmMsS])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
      const unit = t[t.length - 1].toLowerCase();
      const amount = Number(t.slice(0, -1));
      if (unit === 'd') ms += amount * 24 * 60 * 60 * 1000;
      else if (unit === 'h') ms += amount * 60 * 60 * 1000;
      else if (unit === 'm') ms += amount * 60 * 1000;
      else if (unit === 's') ms += amount * 1000;
      else ms += amount * 1000;
    }
    return ms;
  }