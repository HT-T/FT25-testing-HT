import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { GitHubIcon, GoogleIcon, TwitterIcon } from './ProvidersIcon';
import { useAuth } from '../hooks/useAuth';

 export default function OAuthButtonGroup() {
   const { signInWithGoogle } = useAuth();
   return (
     <ButtonGroup variant="outline" spacing="4" width="full">
       <Button
         type="button"
         key="Google"
         width="full"
         onClick={signInWithGoogle}>
         <VisuallyHidden>Sign in with Google</VisuallyHidden>
         <GoogleIcon boxSize="5" />
       </Button>
       <Button
         type="button"
         key="Github"
         width="full"
         >
         <VisuallyHidden>Sign in with Github</VisuallyHidden>
         <GitHubIcon boxSize="5" />       
         </Button>
       
     </ButtonGroup>
   );
 }