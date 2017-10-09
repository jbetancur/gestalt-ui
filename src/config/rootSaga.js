import { metaSagas } from 'Modules/MetaResource';
import { contextManagerSagas } from 'Modules/ContextManagement';

export default function* rootSaga() {
  yield [
    metaSagas(),
    contextManagerSagas(),
  ];
}
