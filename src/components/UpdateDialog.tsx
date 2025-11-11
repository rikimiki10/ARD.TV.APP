import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: string;
  apkUrl: string;
  releaseNotes: string;
}

export function UpdateDialog({ open, onOpenChange, version, apkUrl, releaseNotes }: UpdateDialogProps) {
  const handleUpdate = () => {
    window.open(apkUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nueva versión disponible</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p className="font-semibold">Versión {version}</p>
            <p>{releaseNotes}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleUpdate}>
            Descargar actualización
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
