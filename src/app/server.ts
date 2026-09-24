/* 이 모듈은 app 계층 중 Next 서버에서만 쓰는 것을 연다 */
import 'server-only';

export { getServerQueryClient } from './queryClient.server';
export { getInitialTheme } from './theme.server';
