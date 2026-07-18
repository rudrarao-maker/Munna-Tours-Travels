export const parseStringParam = (param: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined): string | undefined => {
  if (Array.isArray(param)) {
    return typeof param[0] === 'string' ? param[0] : undefined;
  }
  if (typeof param === 'string') {
    return param;
  }
  return undefined;
};
