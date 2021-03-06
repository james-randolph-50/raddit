class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!
  protect_from_forgery


  def index
    if params[:link_id]
      @link = Link.find(params[:link_id])
      @comments = @link.comments
    else
      @comments = Comment.all
    end

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @comments }
  	end
  end

  def create
    @link = Link.find(params[:link_id])
   # binding.pry
    @comment = @link.comments.build(comment_params)
    @comment.user = current_user
    
    if @comment.save
      respond_to do |format|
      #  format.html { redirect_to @link, notice: 'Comment was successfully created.' }
        format.json { render json: @comment, status: :created, location: @comment }
      #  render 'comments/show', :layout => false 
      # render 'create.js', :layout => false
      # else
        format.html { render action: "new" }
      # format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    @comment.destroy
    respond_to do |format|
      format.html { redirect_back fallback_location: root_path, notice: 'Comment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def comment_params
      params.require(:comment).permit(:link_id, :body, :user_id)
    end
end