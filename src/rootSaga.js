import { metaSagas } from 'modules/MetaResource';

export default function* rootSaga() {
  yield [
    metaSagas(),
  ];
}
