/* 이 모듈은 session 슬라이스 중 Next 서버에서만 쓰는 것을 연다 */
import 'server-only';

export { getServerSession } from './api/session.server';
