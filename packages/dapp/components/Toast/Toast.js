import { Toaster, toast } from 'react-hot-toast';

import Error from './Error';
import Success from './Success';
import { ERROR_KIND, SUCCESS_KIND } from './Kind';

const ToastKind = {
  [ERROR_KIND]: (t) => <Error t={t} />,
  [SUCCESS_KIND]: (t) => <Success t={t} />,
};

const notify = ({ kind }) => toast.custom((t) => ToastKind[kind](t));

const Toast = () => (
  <Toaster
    position="bottom-left"
    containerStyle={{ position: 'fixed', marginBottom: '10px' }}
    toastOptions={{
      duration: 10000,
    }}
  />
);

export default Toast;
export { notify };
