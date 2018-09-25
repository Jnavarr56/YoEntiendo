class ConfirmationsController < Devise::ConfirmationsController

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
  
    if resource.errors.empty?
      set_flash_message(:notice, :confirmed)
      sign_in(resource)
      respond_with_navigational(resource){ redirect_to after_confirmation_path_for(resource_name, resource) }
    else
      respond_with_navigational(resource.errors, status: :unprocessable_entity){ render :new }
    end
      
  end

    private
      def after_confirmation_path_for(resource_name, resource)
        '/'
      end

      def after_confirmation_path_for(resource_name, resource)
        if signed_in?(resource_name)
          signed_in_root_path(resource)
        else
          sign_in(resource_name)
          redirect_to '/'
        end
      end
    
    
end