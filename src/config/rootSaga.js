import { metaSagas } from 'Modules/MetaResource';

export default function* rootSaga() {
  yield [
    metaSagas(),
  ];
}
